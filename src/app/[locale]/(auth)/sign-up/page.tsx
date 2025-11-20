import Link from "next/link";
import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";
import { AuthCard } from "@/components/auth/auth-card";

export const dynamic = "force-static";

type SignUpPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: SignUpPageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ja" ? "アカウント作成 | AstraCommerce OS" : "Create Account | AstraCommerce OS";
  const description =
    locale === "ja"
      ? "AstraCommerce OSでチームを立ち上げましょう。"
      : "Create your AstraCommerce OS workspace.";
  return { title, description };
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;
  const dict = await getMarketingDictionary(locale);

  return (
    <div className="flex justify-center">
      <AuthCard
        title={locale === "ja" ? "アカウント作成" : "Create account"}
        subtitle={dict.hero.subtitle}
        footer={
          <Link href={`/${locale}/sign-in`} className="font-semibold text-accent-primary">
            {locale === "ja" ? "すでにアカウントをお持ちですか？ログイン" : "Already have an account? Sign in"}
          </Link>
        }
      >
        <SignUpForm locale={locale} />
      </AuthCard>
    </div>
  );
}
