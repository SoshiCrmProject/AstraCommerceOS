import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { AuthCard } from "@/components/auth/auth-card";
import { WorkspaceSwitcher } from "@/components/auth/workspace-switcher";

export const dynamic = "force-static";

type SwitchPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ email?: string }>;
};

export async function generateMetadata({ params }: SwitchPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ja" ? "ワークスペース切替 | AstraCommerce OS" : "Workspace Switch | AstraCommerce OS",
  };
}

export default async function SwitchPage({ params, searchParams }: SwitchPageProps) {
  const { locale } = await params;
  const resolvedSearch = (await searchParams) || {};
  const userEmail = resolvedSearch.email ?? "";

  const isJa = locale === "ja";
  return (
    <div className="flex justify-center">
      <AuthCard
        title={isJa ? "ワークスペース切替" : "Switch workspace"}
        subtitle={
          isJa
            ? "招待済みのワークスペースから選択します。認証済みメールで読み込みます。"
            : "Select from workspaces you’re a member of. Provide your authenticated email."
        }
      >
        <WorkspaceSwitcher locale={locale} userEmail={userEmail} />
      </AuthCard>
    </div>
  );
}
