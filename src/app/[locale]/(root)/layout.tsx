"use client";

import { useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";

interface PageProps {
  children: ReactNode;
}

const RootLayout = ({ children }: PageProps) => {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale =
    typeof params?.locale === "string" ? params.locale : "uz";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/${locale}/auth/login`);
    }
  }, [status, locale, router]);

  if (status === "loading") {
    return (
      <div className='min-h-screen bg-slate-50 px-4 py-10 text-sm text-slate-500'>
        Yuklanmoqda...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <>
      <Header />
      <main className='min-h-screen bg-slate-50'>{children}</main>
    </>
  );
};

export default RootLayout;
