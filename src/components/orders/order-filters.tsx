"use client";

import { useState } from "react";
import type { OrderFilter, OrderChannelType, OrderStatus, FulfillmentMethod } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type OrderFiltersProps = {
  dict: OrdersDictionary;
  onFilterChange: (filter: OrderFilter) => void;
  locale: string;
};

export function OrderFilters({ dict, onFilterChange, locale }: OrderFiltersProps) {
  const [search, setSearch] = useState("");
  const [channelType, setChannelType] = useState<OrderChannelType | "ALL">("ALL");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod | "ALL">("ALL");
  const [slaBreachedOnly, setSlaBreachedOnly] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      search: search || undefined,
      channelType,
      status,
      fulfillmentMethod,
      slaBreachedOnly,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({
      search: value || undefined,
      channelType,
      status,
      fulfillmentMethod,
      slaBreachedOnly,
    });
  };

  const handleChannelChange = (value: string) => {
    const newChannel = value as OrderChannelType | "ALL";
    setChannelType(newChannel);
    onFilterChange({
      search: search || undefined,
      channelType: newChannel,
      status,
      fulfillmentMethod,
      slaBreachedOnly,
    });
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value as OrderStatus | "ALL";
    setStatus(newStatus);
    onFilterChange({
      search: search || undefined,
      channelType,
      status: newStatus,
      fulfillmentMethod,
      slaBreachedOnly,
    });
  };

  const handleMethodChange = (value: string) => {
    const newMethod = value as FulfillmentMethod | "ALL";
    setFulfillmentMethod(newMethod);
    onFilterChange({
      search: search || undefined,
      channelType,
      status,
      fulfillmentMethod: newMethod,
      slaBreachedOnly,
    });
  };

  const handleSlaToggle = () => {
    const newSlaValue = !slaBreachedOnly;
    setSlaBreachedOnly(newSlaValue);
    onFilterChange({
      search: search || undefined,
      channelType,
      status,
      fulfillmentMethod,
      slaBreachedOnly: newSlaValue,
    });
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="w-full">
        <input
          type="text"
          placeholder={dict.filters.searchPlaceholder}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-card border border-default bg-white px-4 py-2 text-sm text-primary placeholder:text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary-soft"
        />
      </div>

      {/* Filter dropdowns and toggles */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Channel filter */}
        <select
          value={channelType}
          onChange={(e) => handleChannelChange(e.target.value)}
          className="rounded-pill border border-default bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-primary-soft focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary-soft"
        >
          <option value="ALL">{dict.filters.channelAll}</option>
          <option value="AMAZON">{dict.channels.AMAZON}</option>
          <option value="SHOPIFY">{dict.channels.SHOPIFY}</option>
          <option value="SHOPEE">{dict.channels.SHOPEE}</option>
          <option value="RAKUTEN">{dict.channels.RAKUTEN}</option>
          <option value="EBAY">{dict.channels.EBAY}</option>
          <option value="WALMART">{dict.channels.WALMART}</option>
          <option value="YAHOO_SHOPPING">{dict.channels.YAHOO_SHOPPING}</option>
          <option value="MERCARI">{dict.channels.MERCARI}</option>
          <option value="TIKTOK_SHOP">{dict.channels.TIKTOK_SHOP}</option>
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-pill border border-default bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-primary-soft focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary-soft"
        >
          <option value="ALL">{dict.filters.statusAll}</option>
          <option value="PENDING">{dict.statuses.PENDING}</option>
          <option value="AWAITING_PAYMENT">{dict.statuses.AWAITING_PAYMENT}</option>
          <option value="PAID">{dict.statuses.PAID}</option>
          <option value="FULFILLING">{dict.statuses.FULFILLING}</option>
          <option value="SHIPPED">{dict.statuses.SHIPPED}</option>
          <option value="DELIVERED">{dict.statuses.DELIVERED}</option>
          <option value="CANCELLED">{dict.statuses.CANCELLED}</option>
          <option value="RETURN_REQUESTED">{dict.statuses.RETURN_REQUESTED}</option>
          <option value="RETURNED">{dict.statuses.RETURNED}</option>
        </select>

        {/* Fulfillment method filter */}
        <select
          value={fulfillmentMethod}
          onChange={(e) => handleMethodChange(e.target.value)}
          className="rounded-pill border border-default bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-primary-soft focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary-soft"
        >
          <option value="ALL">{dict.filters.fulfillmentMethodAll}</option>
          <option value="FBA">{dict.fulfillmentMethods.FBA}</option>
          <option value="FBM">{dict.fulfillmentMethods.FBM}</option>
          <option value="OWN_WAREHOUSE">{dict.fulfillmentMethods.OWN_WAREHOUSE}</option>
          <option value="3PL">{dict.fulfillmentMethods["3PL"]}</option>
        </select>

        {/* SLA toggle chip */}
        <button
          onClick={handleSlaToggle}
          className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition ${
            slaBreachedOnly
              ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
              : "border-default bg-white text-primary hover:bg-accent-primary-soft"
          }`}
        >
          {dict.filters.slaBreached}
        </button>

        {/* Date range chips (UI only for now) */}
        <button className="rounded-pill border border-default bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-primary-soft">
          {dict.filters.last7}
        </button>
      </div>
    </div>
  );
}
