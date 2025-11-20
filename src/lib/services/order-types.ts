export type OrderChannelType =
  | 'AMAZON'
  | 'SHOPIFY'
  | 'SHOPEE'
  | 'RAKUTEN'
  | 'EBAY'
  | 'WALMART'
  | 'YAHOO_SHOPPING'
  | 'MERCARI'
  | 'TIKTOK_SHOP';

export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'FULFILLING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export type FulfillmentMethod = 'FBA' | 'FBM' | 'OWN_WAREHOUSE' | '3PL';

export type OrderSummary = {
  id: string;
  externalId: string;
  channelType: OrderChannelType;
  channelName: string;
  createdAt: string;
  status: OrderStatus;
  currency: string;
  totalAmount: number;
  customerName?: string;
  fulfillmentMethod: FulfillmentMethod;
  promisedShipDate?: string;
  promisedDeliveryDate?: string;
  shippedAt?: string;
  deliveredAt?: string;
  slaBreached: boolean;
  itemsCount: number;
  destinationCountry: string;
};

export type OrderItem = {
  id: string;
  sku: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  imageUrl?: string;
};

export type OrderAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type OrderTimelineEvent = {
  id: string;
  type:
    | 'CREATED'
    | 'PAID'
    | 'FULFILLMENT_STARTED'
    | 'PICKED'
    | 'PACKED'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURN_REQUESTED'
    | 'RETURN_COMPLETED';
  at: string;
  label: string;
  detail?: string;
};

export type FulfillmentJobStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export type FulfillmentJobSummary = {
  id: string;
  orderId: string;
  channelType: OrderChannelType;
  fulfillmentMethod: FulfillmentMethod;
  status: FulfillmentJobStatus;
  createdAt: string;
  lastUpdatedAt: string;
  warehouseName?: string;
  carrier?: string;
  trackingNumber?: string;
  slaBreached: boolean;
};

export type OrderDetail = {
  summary: OrderSummary;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  timeline: OrderTimelineEvent[];
  fulfillmentJob?: FulfillmentJobSummary;
  notes?: string[];
};

export type OrderPipelineSnapshot = {
  totalOrdersToday: number;
  totalOrders7d: number;
  pendingFulfillment: number;
  shippedToday: number;
  delivered7d: number;
  cancelled7d: number;
  onTimeSlaRate: number;
  channelsBreakdown: {
    channelType: OrderChannelType;
    channelName: string;
    orders7d: number;
    revenue7d: number;
    lateRate: number;
  }[];
};

export type FulfillmentExceptionType =
  | 'LATE_SHIPMENT'
  | 'ADDRESS_ISSUE'
  | 'STOCKOUT'
  | 'CARRIER_DELAY'
  | 'RETURN_DISPUTE';

export type FulfillmentException = {
  id: string;
  orderId: string;
  externalId: string;
  channelType: OrderChannelType;
  type: FulfillmentExceptionType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  resolved: boolean;
  summary: string;
};

export type OrderFilter = {
  search?: string;
  channelType?: OrderChannelType | 'ALL';
  status?: OrderStatus | 'ALL';
  fulfillmentMethod?: FulfillmentMethod | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  slaBreachedOnly?: boolean;
};
