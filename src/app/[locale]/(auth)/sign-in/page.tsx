import Link from "next/link";
import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";
import { AuthCard } from "@/components/auth/auth-card";

export const dynamic = "force-static";

type SignInPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: SignInPageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ja" ? "ログイン | AstraCommerce OS" : "Sign In | AstraCommerce OS";
  const description =
    locale === "ja"
      ? "AstraCommerce OSワークスペースにサインイン"
      : "Sign in to your AstraCommerce OS workspace.";
  return { title, description };
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  const dict = await getMarketingDictionary(locale);

  return (
    <div className="flex justify-center">
      <AuthCard
        title={locale === "ja" ? "ログイン" : "Sign in"}
        subtitle={dict.hero.subtitle}
        footer={
          <div className="flex flex-col gap-1">
            <Link href={`/${locale}/sign-up`} className="font-semibold text-accent-primary">
              {locale === "ja" ? "アカウントを作成" : "Create account"}
            </Link>
            <Link href={`/${locale}/reset-password`} className="text-muted">
              {locale === "ja" ? "パスワードをお忘れですか？" : "Forgot password?"}
            </Link>
          </div>
        }
      >
        <SignInForm locale={locale} />
      </AuthCard>
    </div>
  );
}
