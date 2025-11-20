import type {
  OrderFilter,
  OrderPipelineSnapshot,
  OrderSummary,
  OrderDetail,
  FulfillmentJobSummary,
  FulfillmentException,
  FulfillmentJobStatus,
} from './order-types';
import {
  mockOrderSummaries,
  mockOrderPipelineSnapshot,
  mockFulfillmentJobs,
  mockFulfillmentExceptions,
  mockOrderItems,
  mockAddresses,
  mockTimelines,
} from '../mocks/mock-orders-data';

export class OrderService {
  /**
   * Get order pipeline snapshot with KPIs and channel breakdown
   */
  static async getOrderPipelineSnapshot(
    orgId: string,
    range: { dateFrom?: string; dateTo?: string }
  ): Promise<OrderPipelineSnapshot> {
    void orgId;
    void range;
    // In production, this would query the database
    return mockOrderPipelineSnapshot;
  }

  /**
   * Get paginated list of orders with filtering
   */
  static async getOrderList(
    orgId: string,
    filter: OrderFilter,
    pagination: { page: number; pageSize: number }
  ): Promise<{ items: OrderSummary[]; total: number }> {
    void orgId;

    let filtered = [...mockOrderSummaries];

    // Apply search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.externalId.toLowerCase().includes(searchLower) ||
          order.customerName?.toLowerCase().includes(searchLower)
      );
    }

    // Apply channel filter
    if (filter.channelType && filter.channelType !== 'ALL') {
      filtered = filtered.filter((order) => order.channelType === filter.channelType);
    }

    // Apply status filter
    if (filter.status && filter.status !== 'ALL') {
      filtered = filtered.filter((order) => order.status === filter.status);
    }

    // Apply fulfillment method filter
    if (filter.fulfillmentMethod && filter.fulfillmentMethod !== 'ALL') {
      filtered = filtered.filter(
        (order) => order.fulfillmentMethod === filter.fulfillmentMethod
      );
    }

    // Apply SLA breached filter
    if (filter.slaBreachedOnly) {
      filtered = filtered.filter((order) => order.slaBreached);
    }

    // Apply date filters
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      filtered = filtered.filter((order) => new Date(order.createdAt) >= fromDate);
    }
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      filtered = filtered.filter((order) => new Date(order.createdAt) <= toDate);
    }

    // Sort by created date (newest first)
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const items = filtered.slice(start, end);

    return { items, total };
  }

  /**
   * Get detailed information for a single order
   */
  static async getOrderDetail(orgId: string, orderId: string): Promise<OrderDetail> {
    void orgId;

    const summary = mockOrderSummaries.find((order) => order.id === orderId);
    if (!summary) {
      throw new Error(`Order ${orderId} not found`);
    }

    const items = mockOrderItems[orderId] || [];
    const addresses = mockAddresses[orderId] || {
      shipping: {
        name: summary.customerName || 'Unknown',
        line1: 'Address not available',
        city: 'Unknown',
        postalCode: 'Unknown',
        country: summary.destinationCountry,
      },
    };
    const timeline = mockTimelines[orderId] || [
      {
        id: 'TL-DEFAULT',
        type: 'CREATED',
        at: summary.createdAt,
        label: 'Order created',
        detail: `Order created on ${summary.channelName}`,
      },
    ];

    const fulfillmentJob = mockFulfillmentJobs.find((job) => job.orderId === orderId);

    return {
      summary,
      items,
      shippingAddress: addresses.shipping,
      billingAddress: addresses.billing,
      timeline,
      fulfillmentJob,
      notes: [
        'Customer requested gift wrapping',
        'High-priority customer - expedite if possible',
      ],
    };
  }

  /**
   * Get list of fulfillment jobs with optional status filter
   */
  static async getFulfillmentJobs(
    orgId: string,
    filter: { status?: FulfillmentJobStatus | 'ALL' }
  ): Promise<FulfillmentJobSummary[]> {
    void orgId;

    let jobs = [...mockFulfillmentJobs];

    if (filter.status && filter.status !== 'ALL') {
      jobs = jobs.filter((job) => job.status === filter.status);
    }

    // Sort by last updated (most recent first)
    jobs.sort(
      (a, b) =>
        new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
    );

    return jobs;
  }

  /**
   * Get list of fulfillment exceptions
   */
  static async getFulfillmentExceptions(
    orgId: string,
    filter: {
      resolved?: boolean;
      severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    }
  ): Promise<FulfillmentException[]> {
    void orgId;

    let exceptions = [...mockFulfillmentExceptions];

    if (filter.resolved !== undefined) {
      exceptions = exceptions.filter((exc) => exc.resolved === filter.resolved);
    }

    if (filter.severity) {
      exceptions = exceptions.filter((exc) => exc.severity === filter.severity);
    }

    // Sort by created date (most recent first)
    exceptions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return exceptions;
  }
}
