"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import EmployerResumesClient from "./resumes-client";

export default function EmployerResumesPage() {
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
    if (
      status === "authenticated" &&
      session?.user?.role !== "employer" &&
      session?.user?.role !== "admin"
    ) {
      router.replace(`/${locale}/vacancies`);
    }
  }, [status, session?.user?.role, locale, router]);

  const allowed =
    status === "authenticated" &&
    (session?.user?.role === "employer" || session?.user?.role === "admin");

  if (!allowed) {
    return (
      <div className='px-4 py-10 text-sm text-slate-500'>Yuklanmoqda...</div>
    );
  }

  return <EmployerResumesClient />;
}
