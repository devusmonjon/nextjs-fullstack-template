import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Wishlist from "@/database/wishlist.model";
import Resume from "@/database/resume.model";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "employer" && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();

  const items = await Wishlist.find({ employer: session.user._id })
    .populate({
      path: "resume",
      populate: { path: "user", select: "fullName email role" },
    })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ data: items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "employer" && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { resumeId?: string; action?: "add" | "remove" } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const resumeId = body?.resumeId;
  if (!resumeId) {
    return NextResponse.json(
      { error: "Missing resumeId" },
      { status: 400 }
    );
  }

  await connectToDatabase();
  const resumeExists = await Resume.exists({ _id: resumeId });
  if (!resumeExists) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const action = body?.action;
  if (action === "remove") {
    await Wishlist.deleteOne({ employer: session.user._id, resume: resumeId });
    return NextResponse.json({ ok: true, saved: false });
  }

  if (action === "add") {
    await Wishlist.findOneAndUpdate(
      { employer: session.user._id, resume: resumeId },
      { employer: session.user._id, resume: resumeId },
      { upsert: true }
    );
    return NextResponse.json({ ok: true, saved: true });
  }

  const existing = await Wishlist.findOne({
    employer: session.user._id,
    resume: resumeId,
  });

  if (existing) {
    await Wishlist.deleteOne({ _id: existing._id });
    return NextResponse.json({ ok: true, saved: false });
  }

  await Wishlist.create({ employer: session.user._id, resume: resumeId });
  return NextResponse.json({ ok: true, saved: true });
}
