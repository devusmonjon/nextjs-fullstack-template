"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ExperienceItem {
  company?: string;
  position?: string;
  start?: string;
  end?: string;
  description?: string;
}

interface EducationItem {
  school?: string;
  degree?: string;
  start?: string;
  end?: string;
}

interface Resume {
  _id: string;
  fullName: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  summary: string;
  skills?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  resumeUrl?: string;
  updatedAt?: string;
}

interface WishlistItem {
  resume?: { _id?: string };
}

export default function EmployerResumesClient() {
  const t = useTranslations("resume");
  const common = useTranslations("common");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [resumesRes, wishlistRes] = await Promise.all([
          fetch("/api/resumes"),
          fetch("/api/wishlist"),
        ]);
        const resumesData = await resumesRes.json();
        const wishlistData = await wishlistRes.json();
        setResumes(resumesData?.data || []);
        const ids = new Set<string>(
          (wishlistData?.data || [])
            .map((item: WishlistItem) => item.resume?._id)
            .filter(Boolean)
        );
        setSavedIds(ids);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleWishlist = async (resumeId: string) => {
    const saved = savedIds.has(resumeId);
    setSavingId(resumeId);

    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, action: saved ? "remove" : "add" }),
    });

    setSavedIds((prev) => {
      const next = new Set(prev);
      if (saved) {
        next.delete(resumeId);
      } else {
        next.add(resumeId);
      }
      return next;
    });

    setSavingId(null);
  };

  return (
    <div className='px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-slate-900'>
            {t("browseTitle")}
          </h1>
          <p className='text-sm text-slate-500'>{t("browseSubtitle")}</p>
        </div>

        {loading ? (
          <div className='text-sm text-slate-500'>{common("loading")}</div>
        ) : resumes.length === 0 ? (
          <div className='rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>
            {t("empty")}
          </div>
        ) : (
          <div className='grid gap-4'>
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-900'>
                      {resume.fullName}
                    </h2>
                    <p className='text-sm text-slate-500'>
                      {resume.title} • {resume.location}
                    </p>
                    <p className='mt-1 text-xs text-slate-400'>
                      {resume.email} • {resume.phone}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {resume.resumeUrl && (
                      <Button
                        variant='outline'
                        onClick={() => window.open(resume.resumeUrl, "_blank")}
                      >
                        {t("openResume")}
                      </Button>
                    )}
                    <Button
                      onClick={() => toggleWishlist(resume._id)}
                      disabled={savingId === resume._id}
                    >
                      {savedIds.has(resume._id)
                        ? t("removeWishlist")
                        : t("addWishlist")}
                    </Button>
                  </div>
                </div>

                <p className='mt-3 text-sm text-slate-600'>{resume.summary}</p>

                {resume.skills && resume.skills.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {resume.skills.map((skill) => (
                      <span
                        key={skill}
                        className='rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <details className='mt-4 rounded-xl border border-slate-200 p-4'>
                  <summary className='cursor-pointer text-sm font-medium text-slate-700'>
                    {t("viewDetails")}
                  </summary>
                  <div className='mt-3 grid gap-4 md:grid-cols-2'>
                    <div>
                      <h3 className='text-sm font-semibold text-slate-700'>
                        {t("experience")}
                      </h3>
                      <div className='mt-2 space-y-3 text-sm text-slate-600'>
                        {(resume.experience || []).map((item, idx) => (
                          <div key={`exp-${resume._id}-${idx}`}>
                            <div className='font-medium text-slate-800'>
                              {item.position || t("notProvided")}
                            </div>
                            <div>
                              {item.company} • {item.start} - {item.end}
                            </div>
                            {item.description && (
                              <p className='text-slate-500'>
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))}
                        {(!resume.experience || resume.experience.length === 0) && (
                          <div className='text-slate-400'>{t("notProvided")}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className='text-sm font-semibold text-slate-700'>
                        {t("education")}
                      </h3>
                      <div className='mt-2 space-y-3 text-sm text-slate-600'>
                        {(resume.education || []).map((item, idx) => (
                          <div key={`edu-${resume._id}-${idx}`}>
                            <div className='font-medium text-slate-800'>
                              {item.school || t("notProvided")}
                            </div>
                            <div>
                              {item.degree} • {item.start} - {item.end}
                            </div>
                          </div>
                        ))}
                        {(!resume.education || resume.education.length === 0) && (
                          <div className='text-slate-400'>{t("notProvided")}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
