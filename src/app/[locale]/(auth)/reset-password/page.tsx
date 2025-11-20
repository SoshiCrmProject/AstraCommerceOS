import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { AuthCard } from "@/components/auth/auth-card";

export const dynamic = "force-static";

type ResetPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: ResetPageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ja" ? "パスワードリセット | AstraCommerce OS" : "Reset Password | AstraCommerce OS";
  return { title };
}

export default async function ResetPage({ params }: ResetPageProps) {
  const { locale } = await params;
  const isJa = locale === "ja";
  return (
    <div className="flex justify-center">
      <AuthCard
        title={isJa ? "パスワードリセット" : "Reset password"}
        subtitle={isJa ? "メールにリセットリンクを送信します。" : "We’ll send you a reset link via email."}
      >
        <form
          className="space-y-3"
          action={`${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/auth/v1/recover`}
          method="post"
        >
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-semibold text-primary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            />
          </div>
          <input
            type="hidden"
            name="redirect_to"
            value={(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + `/${locale}/sign-in`}
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
          >
            {isJa ? "メールを送信" : "Send email"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
