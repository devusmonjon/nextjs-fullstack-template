"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExperienceItem {
  company: string;
  position: string;
  start: string;
  end: string;
  description: string;
}

interface EducationItem {
  school: string;
  degree: string;
  start: string;
  end: string;
}

const emptyExperience: ExperienceItem = {
  company: "",
  position: "",
  start: "",
  end: "",
  description: "",
};

const emptyEducation: EducationItem = {
  school: "",
  degree: "",
  start: "",
  end: "",
};

export default function ResumeClient() {
  const t = useTranslations("resume");
  const common = useTranslations("common");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [experience, setExperience] = useState<ExperienceItem[]>([
    { ...emptyExperience },
  ]);
  const [education, setEducation] = useState<EducationItem[]>([
    { ...emptyEducation },
  ]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch("/api/resumes");
        const data = await response.json();
        if (data?.data) {
          const resume = data.data;
          setFullName(resume.fullName || "");
          setTitle(resume.title || "");
          setLocation(resume.location || "");
          setPhone(resume.phone || "");
          setEmail(resume.email || "");
          setSummary(resume.summary || "");
          setSkillsText((resume.skills || []).join(", "));
          setResumeUrl(resume.resumeUrl || "");
          setExperience(
            resume.experience && resume.experience.length > 0
              ? resume.experience
              : [{ ...emptyExperience }]
          );
          setEducation(
            resume.education && resume.education.length > 0
              ? resume.education
              : [{ ...emptyEducation }]
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setExperience((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    setEducation((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    const payload = {
      fullName,
      title,
      location,
      phone,
      email,
      summary,
      skills: skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      experience,
      education,
      resumeUrl,
    };

    const response = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || t("errorGeneric"));
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess(true);
  };

  if (loading) {
    return (
      <div className='px-4 py-10 text-sm text-slate-500'>
        {common("loading")}
      </div>
    );
  }

  return (
    <div className='px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-slate-900'>
            {t("title")}
          </h1>
          <p className='text-sm text-slate-500'>{t("subtitle")}</p>
        </div>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className='mb-4'>
            <AlertDescription>{t("saved")}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4'>
            <h2 className='text-lg font-semibold text-slate-900'>
              {t("basicInfo")}
            </h2>
            <div className='grid gap-4 md:grid-cols-2'>
              <Input
                placeholder={t("fullName")}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
              <Input
                placeholder={t("titleLabel")}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <Input
                placeholder={t("location")}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                required
              />
              <Input
                placeholder={t("phone")}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
              <Input
                placeholder={t("email")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Input
                placeholder={t("resumeUrl")}
                value={resumeUrl}
                onChange={(event) => setResumeUrl(event.target.value)}
              />
            </div>
            <Textarea
              placeholder={t("summary")}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              required
            />
            <Input
              placeholder={t("skills")}
              value={skillsText}
              onChange={(event) => setSkillsText(event.target.value)}
            />
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-slate-900'>
                {t("experience")}
              </h2>
              <Button
                type='button'
                variant='secondary'
                onClick={() =>
                  setExperience((prev) => [...prev, { ...emptyExperience }])
                }
              >
                {t("addExperience")}
              </Button>
            </div>
            <div className='space-y-4'>
              {experience.map((item, index) => (
                <div
                  key={`exp-${index}`}
                  className='rounded-xl border border-slate-200 p-4 space-y-3'
                >
                  <div className='grid gap-3 md:grid-cols-2'>
                    <Input
                      placeholder={t("company")}
                      value={item.company}
                      onChange={(event) =>
                        updateExperience(index, "company", event.target.value)
                      }
                    />
                    <Input
                      placeholder={t("position")}
                      value={item.position}
                      onChange={(event) =>
                        updateExperience(index, "position", event.target.value)
                      }
                    />
                    <Input
                      placeholder={t("start")}
                      value={item.start}
                      onChange={(event) =>
                        updateExperience(index, "start", event.target.value)
                      }
                    />
                    <Input
                      placeholder={t("end")}
                      value={item.end}
                      onChange={(event) =>
                        updateExperience(index, "end", event.target.value)
                      }
                    />
                  </div>
                  <Textarea
                    placeholder={t("description")}
                    value={item.description}
                    onChange={(event) =>
                      updateExperience(index, "description", event.target.value)
                    }
                  />
                  {experience.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() =>
                        setExperience((prev) =>
                          prev.filter((_, idx) => idx !== index)
                        )
                      }
                    >
                      {t("remove")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-slate-900'>
                {t("education")}
              </h2>
              <Button
                type='button'
                variant='secondary'
                onClick={() =>
                  setEducation((prev) => [...prev, { ...emptyEducation }])
                }
              >
                {t("addEducation")}
              </Button>
            </div>
            <div className='space-y-4'>
              {education.map((item, index) => (
                <div
                  key={`edu-${index}`}
                  className='rounded-xl border border-slate-200 p-4 space-y-3'
                >
                  <div className='grid gap-3 md:grid-cols-2'>
                    <Input
                      placeholder={t("school")}
                      value={item.school}
                      onChange={(event) =>
                        updateEducation(index, "school", event.target.value)
                      }
                    />
                    <Input
                      placeholder={t("degree")}
                      value={item.degree}
                      onChange={(event) =>
                        updateEducation(index, "degree", event.target.value)
                      }
                    />
                    <Input
                      placeholder={t("start")}
                      value={item.start}
                      onChange={(event) =>
                        updateEducation(index, "start", event.target.value)
                      }
                    />
                    <Input
                      placeholder={t("end")}
                      value={item.end}
                      onChange={(event) =>
                        updateEducation(index, "end", event.target.value)
                      }
                    />
                  </div>
                  {education.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() =>
                        setEducation((prev) =>
                          prev.filter((_, idx) => idx !== index)
                        )
                      }
                    >
                      {t("remove")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type='submit' className='w-full' disabled={saving}>
            {saving ? common("saving") : common("save")}
          </Button>
        </form>
      </div>
    </div>
  );
}
