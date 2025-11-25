import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { PageHeader } from "@/components/app/page-header";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getProductsDictionary } from "@/i18n/getProductsDictionary";
import { ProductService } from "@/lib/services/product-service";
import { ProductDetailView } from "@/components/products/product-detail-view";


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type ProductDetailPageProps = {
  params: Promise<{ locale: Locale; productId: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, productId } = await params;
  const commonDict = await getAppDictionary(locale);
  const productsDict = await getProductsDictionary(locale);
  const detail = await ProductService.getProductDetail("demo-org", productId).catch(() => null);

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={detail.core.name}
        subtitle={`${detail.core.brand ?? ""} · ${detail.core.primarySku}`}
        breadcrumbs={[
          { label: commonDict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: productsDict.title, href: `/${locale}/app/products` },
          { label: detail.core.name },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/app/pricing?sku=${detail.core.primarySku}`}
              className="btn btn-secondary text-sm"
            >
              {productsDict.actions.openPricing}
            </Link>
            <Link
              href={`/${locale}/app/inventory?sku=${detail.core.primarySku}`}
              className="btn btn-secondary text-sm"
            >
              {productsDict.actions.openInventory}
            </Link>
            <Link
              href={`/${locale}/app/channels`}
              className="btn btn-secondary text-sm"
            >
              {productsDict.actions.openChannels}
            </Link>
            <button className="btn btn-primary text-sm" type="button">
              {productsDict.actions.askCopilot}
            </button>
          </div>
        }
      />

      <ProductDetailView product={detail} locale={locale} dict={productsDict} />
    </div>
  );
}
