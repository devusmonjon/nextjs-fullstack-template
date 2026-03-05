const DEFAULT_CENTRAL_AUTH_URL = "http://localhost:4010/v1";

export type ResumeRole = "admin" | "user" | "employer";

export interface ResumeSessionPayload {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  role: ResumeRole;
  audit_coins?: number;
  balance?: number;
}

interface CentralLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    wallet: {
      auditCoins: number;
      balance: number;
      currency: string;
    };
  };
  project: {
    session: Record<string, unknown>;
  };
}

interface CentralRegisterPayload {
  login: string;
  password: string;
  displayName: string;
  links: Array<{
    project: "audit-resume";
    localUserId: string;
    role: string;
    profileSnapshot: Record<string, unknown>;
  }>;
}

interface CentralApiErrorData {
  message?: string;
}

export class CentralAuthError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function centralAuthBaseUrl(): string {
  return process.env.CENTRAL_AUTH_URL || DEFAULT_CENTRAL_AUTH_URL;
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function requestCentral<T>(
  path: string,
  init: RequestInit,
  includeInternalKey: boolean = false,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (includeInternalKey) {
    const key = process.env.CENTRAL_AUTH_INTERNAL_API_KEY;
    if (!key) {
      throw new CentralAuthError(
        "CENTRAL_AUTH_INTERNAL_API_KEY is not configured",
        500,
      );
    }
    headers.set("x-internal-api-key", key);
  }

  const response = await fetch(`${centralAuthBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const data = await parseJson<CentralApiErrorData & T>(response);

  if (!response.ok) {
    const message =
      data && typeof data.message === "string"
        ? data.message
        : `Central auth request failed: ${response.status}`;
    throw new CentralAuthError(message, response.status, data);
  }

  return data as T;
}

function toRole(value: unknown): ResumeRole {
  const allowed: ResumeRole[] = ["admin", "user", "employer"];
  if (typeof value === "string" && allowed.includes(value as ResumeRole)) {
    return value as ResumeRole;
  }
  return "user";
}

function toNumber(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapCentralResumeSession(
  response: CentralLoginResponse,
): ResumeSessionPayload & { accessToken: string; refreshToken: string } {
  const profile =
    typeof response.project.session === "object" && response.project.session !== null
      ? (response.project.session as Record<string, unknown>)
      : {};

  const id =
    typeof profile._id === "string"
      ? profile._id
      : typeof profile.id === "string"
        ? profile.id
        : "";

  return {
    _id: id,
    id,
    fullName:
      typeof profile.fullName === "string" ? profile.fullName : "Unknown User",
    email: typeof profile.email === "string" ? profile.email : "",
    role: toRole(profile.role),
    audit_coins: toNumber(profile.audit_coins) ?? response.user.wallet.auditCoins,
    balance: toNumber(profile.balance) ?? response.user.wallet.balance,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}

export async function centralResumeLogin(input: {
  identifier: string;
  password: string;
}): Promise<CentralLoginResponse> {
  const clientId = process.env.CENTRAL_AUTH_CLIENT_ID;
  const clientSecret = process.env.CENTRAL_AUTH_CLIENT_SECRET;

  return requestCentral<CentralLoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        identifier: input.identifier,
        password: input.password,
        project: "audit-resume",
        clientId,
        clientSecret,
      }),
    },
    false,
  );
}

export async function centralResumeRegister(
  payload: CentralRegisterPayload,
): Promise<void> {
  await requestCentral(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true,
  );
}
