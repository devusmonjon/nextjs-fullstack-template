"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Vacancy {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements?: string;
  employer?: { _id?: string; fullName?: string };
}

export default function EmployerVacanciesClient() {
  const t = useTranslations("vacancy");
  const common = useTranslations("common");
  const { data: session } = useSession();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const loadVacancies = async () => {
    try {
      const response = await fetch("/api/vacancies");
      const data = await response.json();
      setVacancies(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacancies();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    const response = await fetch("/api/vacancies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        company,
        location,
        type,
        salary: salary || undefined,
        description,
        requirements,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || t("errorGeneric"));
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess(true);
    setTitle("");
    setCompany("");
    setLocation("");
    setType("Full-time");
    setSalary("");
    setDescription("");
    setRequirements("");
    setExpiresAt("");
    await loadVacancies();
  };

  const myVacancies = vacancies.filter(
    (vacancy) => vacancy.employer?._id === session?.user?._id
  );

  return (
    <div className='px-4 py-8'>
      <div className='max-w-5xl mx-auto space-y-8'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-900'>
            {t("postTitle")}
          </h1>
          <p className='text-sm text-slate-500'>{t("postSubtitle")}</p>
        </div>

        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{t("posted")}</AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4'
        >
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              placeholder={t("titleLabel")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <Input
              placeholder={t("company")}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              required
            />
            <Input
              placeholder={t("location")}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
            <select
              className='h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm'
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
            <Input
              placeholder={t("salary")}
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
            />
            <Input
              type='date'
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
            />
          </div>
          <Textarea
            placeholder={t("description")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <Textarea
            placeholder={t("requirements")}
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
          />
          <Button type='submit' className='w-full' disabled={saving}>
            {saving ? common("saving") : t("publish")}
          </Button>
        </form>

        <div>
          <h2 className='text-lg font-semibold text-slate-900 mb-3'>
            {t("yourVacancies")}
          </h2>
          {loading ? (
            <div className='text-sm text-slate-500'>{common("loading")}</div>
          ) : myVacancies.length === 0 ? (
            <div className='rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500'>
              {t("emptyEmployer")}
            </div>
          ) : (
            <div className='grid gap-4'>
              {myVacancies.map((vacancy) => (
                <div
                  key={vacancy._id}
                  className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
                >
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                    <div>
                      <h3 className='text-base font-semibold text-slate-900'>
                        {vacancy.title}
                      </h3>
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
                  <p className='mt-2 text-sm text-slate-600'>
                    {vacancy.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
