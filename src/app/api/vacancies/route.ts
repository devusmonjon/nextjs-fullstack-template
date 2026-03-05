import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Vacancy from "@/database/vacancy.model";

const VACANCY_FIELDS = [
  "title",
  "company",
  "location",
  "type",
  "salary",
  "description",
  "requirements",
  "expiresAt",
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const vacancies = await Vacancy.find({ status: "active" })
    .sort({ createdAt: -1 })
    .populate("employer", "fullName")
    .lean();

  return NextResponse.json({ data: vacancies });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "employer" && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = VACANCY_FIELDS.reduce<Record<string, unknown>>(
    (acc, key) => {
      if (body && key in body) acc[key] = body[key as keyof typeof body];
      return acc;
    },
    {}
  );

  const required = ["title", "company", "location", "type", "description"];
  for (const field of required) {
    if (!payload[field]) {
      return NextResponse.json(
        { error: `Missing field: ${field}` },
        { status: 400 }
      );
    }
  }

  await connectToDatabase();

  const vacancy = await Vacancy.create({
    ...payload,
    employer: session.user._id,
  });

  return NextResponse.json({ ok: true, data: vacancy }, { status: 201 });
}
