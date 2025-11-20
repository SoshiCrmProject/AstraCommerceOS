"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type SignUpFormProps = {
  locale: string;
};

export function SignUpForm({ locale }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const { error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + `/${locale}`,
      },
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage(
      locale === "ja" ? "確認メールを送信しました。メールを確認してください。" : "Confirmation email sent. Please check your inbox.",
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-semibold text-primary">
          Email
        </label>
        <input
          id="email"
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
        {locale === "ja" ? "アカウントを作成" : "Create account"}
      </button>
      {message ? <p className="text-sm text-secondary">{message}</p> : null}
    </form>
  );
}
