"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const nav = useTranslations("navbar");
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isEmployer = role === "employer" || role === "admin";
  const actions = isEmployer
    ? [
        { href: "/employer/resumes", label: nav("resumes") },
        { href: "/employer/wishlist", label: nav("wishlist") },
        { href: "/employer/vacancies", label: nav("postVacancy") },
        { href: "/vacancies", label: nav("vacancies") },
      ]
    : [
        { href: "/vacancies", label: nav("vacancies") },
        { href: "/resume", label: nav("myResume") },
      ];

  return (
    <div className='px-4 py-10'>
      <div className='max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm'>
        <h1 className='text-2xl font-semibold text-slate-900'>
          {t("title")}
        </h1>
        <p className='mt-2 text-sm text-slate-500'>{t("subtitle")}</p>
        <div className='mt-6 grid gap-3 md:grid-cols-2'>
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-100'
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
