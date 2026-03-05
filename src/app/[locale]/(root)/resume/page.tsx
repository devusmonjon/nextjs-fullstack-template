"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import ResumeClient from "./resume-client";

export default function ResumePage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale =
    typeof params?.locale === "string" ? params.locale : "uz";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/${locale}/auth/login`);
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "user") {
      router.replace(`/${locale}/employer/resumes`);
    }
  }, [status, session?.user?.role, locale, router]);

  if (status !== "authenticated" || session?.user?.role !== "user") {
    return (
      <div className='px-4 py-10 text-sm text-slate-500'>Yuklanmoqda...</div>
    );
  }

  return <ResumeClient />;
}
