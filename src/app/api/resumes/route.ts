import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Resume from "@/database/resume.model";

const RESUME_FIELDS = [
  "fullName",
  "title",
  "location",
  "phone",
  "email",
  "summary",
  "skills",
  "experience",
  "education",
  "resumeUrl",
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const role = session.user.role;
  if (role === "employer" || role === "admin") {
    const resumes = await Resume.find({})
      .sort({ updatedAt: -1 })
      .lean();
    return NextResponse.json({ data: resumes });
  }

  const resume = await Resume.findOne({ user: session.user._id }).lean();
  return NextResponse.json({ data: resume });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = RESUME_FIELDS.reduce<Record<string, unknown>>(
    (acc, key) => {
      if (body && key in body) acc[key] = body[key as keyof typeof body];
      return acc;
    },
    {}
  );

  const required = ["fullName", "title", "location", "phone", "email", "summary"];
  for (const field of required) {
    if (!payload[field]) {
      return NextResponse.json(
        { error: `Missing field: ${field}` },
        { status: 400 }
      );
    }
  }

  await connectToDatabase();

  const resume = await Resume.findOneAndUpdate(
    { user: session.user._id },
    { ...payload, user: session.user._id },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ ok: true, data: resume });
}
