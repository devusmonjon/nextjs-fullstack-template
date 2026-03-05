import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const nav = useTranslations("navbar");
  return (
    <div className='px-4 py-10'>
      <div className='max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center'>
        <h1 className='text-2xl font-semibold text-slate-900'>{t("title")}</h1>
        <p className='mt-2 text-sm text-slate-500'>{t("subtitle")}</p>
        <Link
          href='/vacancies'
          className='mt-6 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white'
        >
          {nav("vacancies")}
        </Link>
      </div>
    </div>
  );
}
