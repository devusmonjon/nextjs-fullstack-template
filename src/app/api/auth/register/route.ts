import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import { centralResumeRegister } from "@/lib/central-auth";

const ALLOWED_ROLES = ["user", "employer"] as const;

export async function POST(req: Request) {
  let body: {
    fullName?: string;
    email?: string;
    password?: string;
    role?: (typeof ALLOWED_ROLES)[number];
  } | null = null;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fullName = body?.fullName?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;
  const role = body?.role;

  if (!fullName || !email || !password || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password: passwordHash,
    role,
  });

  try {
    await centralResumeRegister({
      login: email,
      password,
      displayName: user.fullName,
      links: [
        {
          project: "audit-resume",
          localUserId: user._id.toString(),
          role: user.role,
          profileSnapshot: {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
        },
      ],
    });
  } catch {
    await User.deleteOne({ _id: user._id });
    return NextResponse.json(
      { error: "Central auth registration failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, userId: user._id }, { status: 201 });
}
