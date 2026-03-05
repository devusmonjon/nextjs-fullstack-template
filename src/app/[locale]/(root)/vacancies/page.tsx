"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface Vacancy {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements?: string;
  employer?: { fullName?: string };
}

export default function VacanciesPage() {
  const t = useTranslations("vacancy");
  const common = useTranslations("common");
  const { data: session } = useSession();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const response = await fetch("/api/vacancies");
        const data = await response.json();
        setVacancies(data?.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadVacancies();
  }, []);

  return (
    <div className='px-4 py-8'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-2xl font-semibold text-slate-900'>
              {t("title")}
            </h1>
            <p className='text-sm text-slate-500'>{t("subtitle")}</p>
          </div>
          {(session?.user?.role === "employer" ||
            session?.user?.role === "admin") && (
            <Button variant='secondary' className='w-fit' asChild>
              <Link href='/employer/vacancies'>{t("employerHint")}</Link>
            </Button>
          )}
        </div>

        {loading ? (
          <div className='text-sm text-slate-500'>{common("loading")}</div>
        ) : vacancies.length === 0 ? (
          <div className='rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>
            {t("empty")}
          </div>
        ) : (
          <div className='grid gap-4'>
            {vacancies.map((vacancy) => (
              <div
                key={vacancy._id}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-900'>
                      {vacancy.title}
                    </h2>
                    <p className='text-sm text-slate-500'>
                      {vacancy.company} • {vacancy.location} • {vacancy.type}
                    </p>
                  </div>
                  {vacancy.salary && (
                    <span className='inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
                      {vacancy.salary}
                    </span>
                  )}
                </div>

                <p className='mt-3 text-sm text-slate-600'>
                  {vacancy.description}
                </p>

                {vacancy.requirements && (
                  <p className='mt-2 text-sm text-slate-500'>
                    <span className='font-medium text-slate-700'>
                      {t("requirements")}:
                    </span>{" "}
                    {vacancy.requirements}
                  </p>
                )}

                {vacancy.employer?.fullName && (
                  <p className='mt-2 text-xs text-slate-400'>
                    {t("postedBy")}: {vacancy.employer.fullName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
