import {
  ListingSummary,
  ListingDetail,
  ListingFilter,
  ListingStatus,
  AiListingGeneration
} from './listing-types';
import { getMockListings, getMockListingDetail } from '../mocks/listings';

export async function getListingList(
  orgId: string,
  filter: ListingFilter,
  pagination: { page: number; pageSize: number }
): Promise<{ items: ListingSummary[]; total: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let listings = getMockListings();
  
  // Apply filters
  if (filter.search) {
    const search = filter.search.toLowerCase();
    listings = listings.filter(l => 
      l.productName.toLowerCase().includes(search) ||
      l.sku.toLowerCase().includes(search) ||
      l.id.toLowerCase().includes(search)
    );
  }
  
  if (filter.channelType && filter.channelType !== 'ALL') {
    listings = listings.filter(l => l.channelType === filter.channelType);
  }
  
  if (filter.status && filter.status !== 'ALL') {
    listings = listings.filter(l => l.status === filter.status);
  }
  
  if (filter.region) {
    listings = listings.filter(l => l.region === filter.region);
  }
  
  if (filter.hasErrors) {
    listings = listings.filter(l => l.hasErrors);
  }
  
  if (filter.lowStockOnly) {
    listings = listings.filter(l => l.stock < 10);
  }
  
  // Apply pagination
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  const paginatedItems = listings.slice(start, end);
  
  return {
    items: paginatedItems,
    total: listings.length
  };
}

export async function getListingDetail(
  orgId: string,
  listingId: string
): Promise<ListingDetail> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return getMockListingDetail(listingId);
}

export async function bulkUpdateListingStatus(
  orgId: string,
  listingIds: string[],
  status: ListingStatus
): Promise<{ updated: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return { updated: listingIds.length };
}

export async function bulkTriggerResync(
  orgId: string,
  listingIds: string[]
): Promise<{ acceptedJobs: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { acceptedJobs: listingIds.length };
}

export async function generateAiListing(
  prompt: string,
  language: 'en' | 'ja',
  tone: 'professional' | 'friendly' | 'premium' | 'technical'
): Promise<AiListingGeneration> {
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock AI response based on language
  if (language === 'ja') {
    return {
      title: 'プレミアム ワイヤレス ヘッドフォン - 高音質・長時間バッテリー',
      bulletPoints: [
        '高品質な音響技術による優れた音質',
        '最大30時間の連続再生可能なバッテリー',
        '快適な装着感のエルゴノミクスデザイン',
        'ノイズキャンセリング機能搭載',
        '1年間の製品保証付き'
      ],
      description: 'プレミアムな音質と快適性を追求したワイヤレスヘッドフォンです。先進的な音響技術により、クリアで豊かなサウンドをお楽しみいただけます。',
      keywords: ['ワイヤレス', 'ヘッドフォン', '高音質', 'ノイズキャンセリング', 'プレミアム']
    };
  }
  
  return {
    title: 'Premium Wireless Headphones - Superior Sound Quality & Long Battery Life',
    bulletPoints: [
      'Advanced acoustic technology for exceptional sound quality',
      'Up to 30 hours of continuous playback time',
      'Ergonomic design for all-day comfort',
      'Active noise cancellation technology',
      '1-year manufacturer warranty included'
    ],
    description: 'Experience premium audio quality and comfort with these advanced wireless headphones. Featuring cutting-edge acoustic technology for crystal-clear, rich sound.',
    keywords: ['wireless', 'headphones', 'premium', 'noise-cancelling', 'high-quality']
  };
}