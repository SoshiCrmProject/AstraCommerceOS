import { type Locale } from "@/i18n/config";
import { PageHeader } from "@/components/app/page-header";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getProductsDictionary } from "@/i18n/getProductsDictionary";
import { ProductService } from "@/lib/services/product-service";
import { type ProductCopilotSuggestion } from "@/lib/services/product-types";
import { ProductsCatalog } from "@/components/products/product-catalog";


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type ProductsPageProps = {
  params: Promise<{ locale: Locale }>;
};

async function askCopilotAction(prompt: string): Promise<ProductCopilotSuggestion[]> {
  "use server";
  const { suggestions } = await ProductService.getProductResearchSuggestions("demo-org", prompt);
  return suggestions;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const commonDict = await getAppDictionary(locale);
  const productsDict = await getProductsDictionary(locale);
  const list = await ProductService.getProductList("demo-org", {});

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={productsDict.title}
        subtitle={productsDict.subtitle}
        breadcrumbs={[
          { label: commonDict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: productsDict.title },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-secondary text-sm" type="button">
              {productsDict.actions.import}
            </button>
            <button className="btn btn-primary text-sm" type="button">
              {productsDict.actions.addProduct}
            </button>
          </div>
        }
      />

      <ProductsCatalog
        items={list.items}
        totalCount={list.totalCount}
        locale={locale}
        dict={productsDict}
        onAskCopilot={askCopilotAction}
      />
    </div>
  );
}
