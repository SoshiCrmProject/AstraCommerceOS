import { 
  ListingSummary, 
  ListingDetail, 
  ListingChannelType, 
  ListingStatus, 
  ListingComplianceFlag,
  ListingErrorDetail,
  ListingContent
} from '../services/listing-types';

const mockListings: ListingSummary[] = [
  {
    id: 'lst_001',
    productId: 'prod_001',
    productName: 'Premium Wireless Headphones',
    sku: 'WH-001-BLK',
    mainImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    channelType: 'AMAZON',
    channelName: 'Amazon JP',
    region: 'JP',
    status: 'ACTIVE',
    price: 15800,
    currency: 'JPY',
    stock: 45,
    orders30d: 23,
    lastUpdatedAt: '2024-01-15T10:30:00Z',
    hasErrors: false,
    complianceFlags: []
  },
  {
    id: 'lst_002',
    productId: 'prod_002',
    productName: 'Smart Fitness Tracker',
    sku: 'FT-002-RED',
    mainImageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300',
    channelType: 'SHOPIFY',
    channelName: 'Shopify Store',
    region: 'US',
    status: 'ERROR',
    price: 89.99,
    currency: 'USD',
    stock: 12,
    orders30d: 8,
    lastUpdatedAt: '2024-01-14T15:45:00Z',
    hasErrors: true,
    complianceFlags: ['TITLE_TOO_LONG', 'MISSING_ATTRIBUTES']
  },
  {
    id: 'lst_003',
    productId: 'prod_003',
    productName: 'Organic Cotton T-Shirt',
    sku: 'TS-003-WHT-M',
    mainImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    channelType: 'SHOPEE',
    channelName: 'Shopee SG',
    region: 'SG',
    status: 'OUT_OF_STOCK',
    price: 25.50,
    currency: 'SGD',
    stock: 0,
    orders30d: 15,
    lastUpdatedAt: '2024-01-13T09:20:00Z',
    hasErrors: false,
    complianceFlags: []
  },
  {
    id: 'lst_004',
    productId: 'prod_004',
    productName: 'Bluetooth Speaker Pro',
    sku: 'SP-004-BLU',
    mainImageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
    channelType: 'RAKUTEN',
    channelName: 'Rakuten JP',
    region: 'JP',
    status: 'PAUSED',
    price: 8900,
    currency: 'JPY',
    stock: 28,
    orders30d: 5,
    lastUpdatedAt: '2024-01-12T14:10:00Z',
    hasErrors: true,
    complianceFlags: ['PROHIBITED_KEYWORD']
  }
];

const mockErrors: ListingErrorDetail[] = [
  {
    id: 'err_001',
    code: 'TITLE_LENGTH_EXCEEDED',
    message: 'Title exceeds maximum length of 120 characters for this category',
    category: 'CONTENT',
    severity: 'ERROR',
    occurredAt: '2024-01-14T15:45:00Z',
    resolved: false
  },
  {
    id: 'err_002',
    code: 'MISSING_BRAND_ATTRIBUTE',
    message: 'Brand attribute is required for this product category',
    category: 'BRAND',
    severity: 'WARNING',
    occurredAt: '2024-01-14T15:45:00Z',
    resolved: false
  }
];

export const getMockListings = (): ListingSummary[] => mockListings;

export const getMockListingDetail = (listingId: string): ListingDetail => {
  const summary = mockListings.find(l => l.id === listingId) || mockListings[0];
  
  return {
    summary,
    content: {
      title: summary.productName,
      subtitle: 'Premium quality product with advanced features',
      bulletPoints: [
        'High-quality materials and construction',
        'Advanced technology for superior performance',
        'Ergonomic design for comfort',
        'Long-lasting battery life',
        '1-year warranty included'
      ],
      description: 'Experience the perfect blend of style and functionality with this premium product. Crafted with attention to detail and built to last.',
      keywords: ['premium', 'quality', 'durable', 'advanced', 'comfortable'],
      attributes: [
        { name: 'Brand', value: 'AstraCommerce' },
        { name: 'Color', value: 'Black' },
        { name: 'Material', value: 'Premium Plastic' },
        { name: 'Weight', value: '250g' }
      ]
    },
    images: [
      { url: summary.mainImageUrl || '', alt: 'Main product image' },
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', alt: 'Side view' },
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', alt: 'Detail view' }
    ],
    variations: [
      {
        sku: summary.sku,
        attributes: { Color: 'Black', Size: 'Standard' },
        price: summary.price,
        stock: summary.stock
      },
      {
        sku: summary.sku.replace('BLK', 'WHT'),
        attributes: { Color: 'White', Size: 'Standard' },
        price: summary.price + 500,
        stock: 20
      }
    ],
    errors: summary.hasErrors ? mockErrors : [],
    history: [
      {
        id: 'hist_001',
        changedAt: '2024-01-15T10:30:00Z',
        changedBy: 'John Doe',
        changeSummary: 'Updated product title and description'
      },
      {
        id: 'hist_002',
        changedAt: '2024-01-14T09:15:00Z',
        changedBy: 'Jane Smith',
        changeSummary: 'Price adjustment from competitive analysis'
      }
    ]
  };
};