import { mockProductCatalog } from "../mocks/mock-product-data";
import {
  type ProductCopilotSuggestion,
  type ProductDetail,
  type ProductListFilter,
  type ProductListResult,
  type ProductRow,
} from "./product-types";

export class ProductService {
  static async getProductList(orgId: string, filters: ProductListFilter): Promise<ProductListResult> {
    void orgId;
    const baseList: ProductRow[] = mockProductCatalog.map((product) => ({
      core: product.core,
      sales: product.sales,
      inventory: product.inventory,
      review: product.review,
      research: product.research,
      listings: product.listings,
    }));

    const filtered = baseList
      .filter((item) => {
        if (filters.search) {
          const search = filters.search.toLowerCase();
          const match =
            item.core.name.toLowerCase().includes(search) ||
            item.core.primarySku.toLowerCase().includes(search) ||
            (item.core.brand ?? "").toLowerCase().includes(search);
          if (!match) return false;
        }
        if (filters.brand && item.core.brand !== filters.brand) return false;
        if (filters.category && item.core.category !== filters.category) return false;
        if (filters.tag && !(item.core.tags ?? []).includes(filters.tag)) return false;
        if (filters.status && item.core.status !== filters.status) return false;
        if (filters.channelType) {
          const found = mockProductCatalog
            .find((p) => p.core.id === item.core.id)
            ?.listings.some((listing) => listing.channelType === filters.channelType);
          if (!found) return false;
        }
        if (filters.stockStatus === "LOW" && !item.inventory.lowStock) return false;
        if (filters.stockStatus === "OOS" && !item.inventory.outOfStock) return false;
        if (filters.stockStatus === "OK" && (item.inventory.lowStock || item.inventory.outOfStock))
          return false;
        return true;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case "REVENUE_7D":
            return b.sales.revenue7d - a.sales.revenue7d;
          case "REVENUE_30D":
            return b.sales.revenue30d - a.sales.revenue30d;
          case "ORDERS_7D":
            return b.sales.orders7d - a.sales.orders7d;
          case "PROFIT_30D":
            return b.sales.profit30d - a.sales.profit30d;
          case "CREATED_AT":
            return new Date(b.core.createdAt).getTime() - new Date(a.core.createdAt).getTime();
          default:
            return 0;
        }
      });

    return { items: filtered, totalCount: filtered.length };
  }

  static async getProductDetail(orgId: string, productId: string): Promise<ProductDetail> {
    void orgId;
    const detail = mockProductCatalog.find(
      (p) => p.core.id === productId || p.core.primarySku === productId,
    );
    if (!detail) {
      throw new Error("Product not found");
    }
    return detail;
  }

  static async getProductResearchSuggestions(
    orgId: string,
    prompt: string,
  ): Promise<{ suggestions: ProductCopilotSuggestion[] }> {
    void orgId;
    const normalized = prompt.toLowerCase();
    const wantsMargin =
      normalized.includes("high margin") ||
      normalized.includes("high-margin") ||
      normalized.includes("margin") ||
      normalized.includes("高マージン");
    const wantsStock =
      normalized.includes("stock") ||
      normalized.includes("stockout") ||
      normalized.includes("欠品") ||
      normalized.includes("在庫");
    const wantsExpand =
      normalized.includes("winner") ||
      normalized.includes("expand") ||
      normalized.includes("拡大") ||
      normalized.includes("チャネル");
    const suggestions = mockProductCatalog
      .map((product) => {
        const base: ProductCopilotSuggestion = {
          title: `${product.core.primarySku} · ${product.core.name}`,
          details: product.aiSummary,
          skus: [product.core.primarySku],
        };

        if (wantsMargin) {
          return product.research.marginPercent && product.research.marginPercent > 30
            ? {
                ...base,
                details: `Margin ${product.research.marginPercent}% with ROI ${product.research.roiPercent}% · ${product.aiSummary}`,
              }
            : null;
        }

        if (wantsStock) {
          return product.inventory.lowStock || product.inventory.outOfStock ? base : null;
        }

        if (wantsExpand) {
          return product.listings.length >= 2 ? base : null;
        }

        return base;
      })
      .filter(Boolean) as ProductCopilotSuggestion[];

    return { suggestions: suggestions.slice(0, 6) };
  }
}
