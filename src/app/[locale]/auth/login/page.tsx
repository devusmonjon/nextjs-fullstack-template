"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

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
      <div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl p-8'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-slate-900'>
            {t("loginTitle")}
          </h1>
          <p className='mt-2 text-sm text-slate-500'>{t("loginSubtitle")}</p>
        </div>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
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

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? t("signingIn") : t("signIn")}
          </Button>
        </form>

        <div className='mt-6 text-center text-sm text-slate-500'>
          {t("noAccount")}{" "}
          <Link href='/auth/register' className='text-blue-600 hover:underline'>
            {t("goRegister")}
          </Link>
        </div>
      </div>
    </div>
  );
}
