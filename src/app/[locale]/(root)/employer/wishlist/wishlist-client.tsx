"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface Resume {
  _id: string;
  fullName: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  summary: string;
  skills?: string[];
  resumeUrl?: string;
}

interface WishlistItem {
  _id: string;
  resume?: Resume;
}

export default function WishlistClient() {
  const t = useTranslations("wishlist");
  const resumeLang = useTranslations("resume");
  const common = useTranslations("common");
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const response = await fetch("/api/wishlist");
      const data = await response.json();
      setItems(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const removeItem = async (resumeId?: string) => {
    if (!resumeId) return;
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, action: "remove" }),
    });
    await loadItems();
  };

  return (
    <div className='px-4 py-8'>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-slate-900'>
            {t("title")}
          </h1>
          <p className='text-sm text-slate-500'>{t("subtitle")}</p>
        </div>

        {loading ? (
          <div className='text-sm text-slate-500'>{common("loading")}</div>
        ) : items.length === 0 ? (
          <div className='rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>
            {t("empty")}
          </div>
        ) : (
          <div className='grid gap-4'>
            {items.map((item) => (
              <div
                key={item._id}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-900'>
                      {item.resume?.fullName}
                    </h2>
                    <p className='text-sm text-slate-500'>
                      {item.resume?.title} • {item.resume?.location}
                    </p>
                    <p className='mt-1 text-xs text-slate-400'>
                      {item.resume?.email} • {item.resume?.phone}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {item.resume?.resumeUrl && (
                      <Button
                        variant='outline'
                        onClick={() =>
                          item.resume?.resumeUrl &&
                          window.open(item.resume.resumeUrl, "_blank")
                        }
                      >
                        {resumeLang("openResume")}
                      </Button>
                    )}
                    <Button
                      variant='ghost'
                      onClick={() => removeItem(item.resume?._id)}
                    >
                      {resumeLang("removeWishlist")}
                    </Button>
                  </div>
                </div>
                {item.resume?.summary && (
                  <p className='mt-3 text-sm text-slate-600'>
                    {item.resume.summary}
                  </p>
                )}
                {item.resume?.skills && item.resume.skills.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {item.resume.skills.map((skill) => (
                      <span
                        key={skill}
                        className='rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
