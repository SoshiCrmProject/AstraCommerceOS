"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type SignInFormProps = {
  locale: string;
};

export function SignInForm({ locale }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handlePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage(locale === "ja" ? "ログインしました" : "Signed in");
    // Force a full page reload to ensure cookies are set
    window.location.href = `/${locale}/app`;
  };

  const sendMagicLink = async () => {
    if (!email) {
      setMessage(locale === "ja" ? "メールアドレスを入力してください。" : "Please enter your email.");
      return;
    }
    setMessage(null);
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + `/${locale}`,
      },
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage(locale === "ja" ? "メールでログインリンクを送信しました" : "Magic link sent to your email.");
  };

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMagicLink();
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          void sendMagicLink();
        }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-default bg-surface px-4 py-2 text-sm font-semibold text-primary shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
      >
        {locale === "ja" ? "会社メールで続行（SSO/リンク）" : "Continue with corporate email (SSO/link)"}
      </button>

      <div className="relative text-center text-xs uppercase tracking-wide text-muted">
        <span className="bg-surface px-3">{locale === "ja" ? "または" : "or"}</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-default" />
      </div>

      <form onSubmit={handlePassword} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-semibold text-primary">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-semibold text-primary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
        >
          {locale === "ja" ? "パスワードでログイン" : "Sign in with password"}
        </button>
      </form>

      <div className="rounded-card border border-default bg-surface-muted p-4">
        <p className="text-sm font-semibold text-primary">
          {locale === "ja" ? "メールリンクでログイン" : "Sign in with magic link"}
        </p>
        <form onSubmit={handleMagicLink} className="mt-2 space-y-2">
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-pill border border-default bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
          >
            {locale === "ja" ? "メールを送信" : "Send link"}
          </button>
        </form>
      </div>

      {message ? <p className="text-sm text-secondary">{message}</p> : null}
    </div>
  );
}
