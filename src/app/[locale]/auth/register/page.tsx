"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Role = "user" | "employer";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, role }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || t("errorGeneric"));
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("invalidCredentials"));
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl p-8'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-slate-900'>
            {t("registerTitle")}
          </h1>
          <p className='mt-2 text-sm text-slate-500'>
            {t("registerSubtitle")}
          </p>
        </div>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='fullName'>{t("fullName")}</Label>
            <Input
              id='fullName'
              type='text'
              placeholder='Ismingiz va familiyangiz'
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>{t("email")}</Label>
            <Input
              id='email'
              type='email'
              placeholder='name@example.com'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>{t("password")}</Label>
            <Input
              id='password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className='space-y-3'>
            <p className='text-sm font-medium text-slate-700'>
              {t("roleQuestion")}
            </p>
            <div className='grid gap-3 md:grid-cols-2'>
              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                role === "user"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200"
              }`}>
                <input
                  type='radio'
                  name='role'
                  value='user'
                  className='mt-1'
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                />
                <div>
                  <div className='text-sm font-semibold text-slate-900'>
                    {t("roleUser")}
                  </div>
                  <p className='text-xs text-slate-500'>
                    {t("roleUserHint")}
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                role === "employer"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200"
              }`}>
                <input
                  type='radio'
                  name='role'
                  value='employer'
                  className='mt-1'
                  checked={role === "employer"}
                  onChange={() => setRole("employer")}
                />
                <div>
                  <div className='text-sm font-semibold text-slate-900'>
                    {t("roleEmployer")}
                  </div>
                  <p className='text-xs text-slate-500'>
                    {t("roleEmployerHint")}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? t("creating") : t("createAccount")}
          </Button>
        </form>

        <div className='mt-6 text-center text-sm text-slate-500'>
          {t("haveAccount")}{" "}
          <Link href='/auth/login' className='text-blue-600 hover:underline'>
            {t("goLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
