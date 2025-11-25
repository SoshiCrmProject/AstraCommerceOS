export default {
  automation: {
    title: "Automation",
    subtitle: "Automate your dropshipping workflow",
    
    // Settings page
    settings: {
      title: "Auto-Fulfillment Settings",
      subtitle: "Configure automated Amazon purchasing",
      enableLabel: "Enable Auto-Fulfillment",
      enableDescription: "Automatically purchase products from Amazon when Shopee orders are received",
      
      profitSettings: "Profit Settings",
      minProfitLabel: "Minimum Expected Profit",
      minProfitDescription: "Only process orders with profit above this amount",
      minProfitPlaceholder: "e.g., 500",
      
      shippingSettings: "Shipping Settings",
      maxDeliveryLabel: "Maximum Delivery Days",
      maxDeliveryDescription: "Reject orders if Amazon shipping takes longer than this",
      maxDeliveryPlaceholder: "e.g., 7",
      
      includePointsLabel: "Include Amazon Points in Profit",
      includePointsDescription: "Count Amazon reward points as revenue when calculating profit",
      
      includeDomesticLabel: "Include Domestic Shipping",
      includeDomesticDescription: "Include domestic shipping costs in profit calculation",
      
      amazonCredentials: "Amazon Credentials",
      amazonEmailLabel: "Amazon Email",
      amazonEmailPlaceholder: "your-amazon-email@example.com",
      amazonPasswordLabel: "Amazon Password",
      amazonPasswordPlaceholder: "Enter your Amazon password",
      amazonTotpLabel: "2FA Secret (Optional)",
      amazonTotpDescription: "TOTP secret for two-factor authentication",
      
      channelFilters: "Channel Filters",
      eligibleChannelsLabel: "Eligible Channels",
      eligibleChannelsDescription: "Select which shops to monitor for auto-fulfillment",
      allChannelsLabel: "All Channels",
      
      riskSettings: "Risk Management",
      maxDailyOrdersLabel: "Max Daily Orders",
      maxDailyOrdersDescription: "Limit automated orders per day to avoid detection",
      maxDailyOrdersPlaceholder: "e.g., 10",
      
      requireApprovalLabel: "Require Manual Approval",
      requireApprovalDescription: "Hold orders for manual review before purchasing",
      
      shopeeSettings: "Shopee Settings",
      commissionRateLabel: "Shopee Commission Rate",
      commissionRateDescription: "Shopee's commission percentage (default: 5%)",
      commissionRatePlaceholder: "5",
      
      saveButton: "Save Settings",
      cancelButton: "Cancel",
      saveSuccess: "Settings saved successfully",
      saveError: "Failed to save settings",
      
      warning: "⚠️ Warning: Automated purchasing may violate Amazon's Terms of Service",
      warningDetails: "Using browser automation to purchase from Amazon carries risk of account suspension. Use at your own risk.",
      acknowledgeLabel: "I understand the risks and wish to proceed",
    },
    
    // Jobs page
    jobs: {
      title: "Auto-Fulfillment Jobs",
      subtitle: "Monitor and manage automated purchases",
      
      filters: "Filters",
      statusFilter: "Status",
      allStatuses: "All Statuses",
      dateFilter: "Date Range",
      searchPlaceholder: "Search by Order ID, ASIN...",
      
      table: {
        jobId: "Job ID",
        orderId: "Order ID",
        sku: "SKU",
        asin: "ASIN",
        quantity: "Qty",
        shopeePrice: "Shopee Price",
        amazonCost: "Amazon Cost",
        profit: "Profit",
        status: "Status",
        createdAt: "Created",
        actions: "Actions",
      },
      
      status: {
        pending: "Pending",
        evaluating: "Evaluating",
        approved: "Approved",
        purchasing: "Purchasing",
        completed: "Completed",
        failed: "Failed",
        rejected: "Rejected",
      },
      
      actions: {
        view: "View Details",
        retry: "Retry",
        approve: "Approve",
        cancel: "Cancel",
      },
      
      details: {
        title: "Job Details",
        orderInfo: "Order Information",
        profitBreakdown: "Profit Breakdown",
        amazonDetails: "Amazon Details",
        errorLog: "Error Log",
        
        shopeeRevenue: "Shopee Revenue",
        shopeeCommission: "Shopee Commission",
        amazonPrice: "Amazon Price",
        amazonShipping: "Amazon Shipping",
        amazonTax: "Amazon Tax",
        amazonPoints: "Amazon Points",
        totalCost: "Total Cost",
        netProfit: "Net Profit",
        
        retryButton: "Retry Purchase",
        approveButton: "Approve Purchase",
        cancelButton: "Cancel Job",
      },
      
      empty: "No auto-fulfillment jobs yet",
      emptyDescription: "Jobs will appear here when orders are processed",
    },
    
    // Mappings page
    mappings: {
      title: "Product Mappings",
      subtitle: "Manage Shopee to Amazon product mappings",
      
      addButton: "Add Mapping",
      importButton: "Import CSV",
      exportButton: "Export",
      
      table: {
        shopeeSku: "Shopee SKU",
        shopeeProduct: "Shopee Product",
        amazonAsin: "Amazon ASIN",
        amazonProduct: "Amazon Product",
        mappingType: "Type",
        confidence: "Confidence",
        status: "Status",
        lastVerified: "Last Verified",
        actions: "Actions",
      },
      
      mappingType: {
        manual: "Manual",
        automatic: "Automatic",
        verified: "Verified",
      },
      
      verificationStatus: {
        pending: "Pending",
        verified: "Verified",
        failed: "Failed",
      },
      
      actions: {
        edit: "Edit",
        verify: "Verify",
        delete: "Delete",
        viewAmazon: "View on Amazon",
      },
      
      addModal: {
        title: "Add Product Mapping",
        shopeeSkuLabel: "Shopee SKU",
        shopeeSkuPlaceholder: "Enter Shopee SKU",
        amazonAsinLabel: "Amazon ASIN",
        amazonAsinPlaceholder: "Enter Amazon ASIN (e.g., B08N5WRWNW)",
        amazonUrlLabel: "Amazon URL (Optional)",
        amazonUrlPlaceholder: "https://www.amazon.com/...",
        confidenceLabel: "Confidence Score",
        saveButton: "Add Mapping",
        cancelButton: "Cancel",
      },
      
      empty: "No product mappings yet",
      emptyDescription: "Add mappings to link your Shopee products to Amazon",
    },
    
    // Dashboard widget
    overview: {
      title: "Auto-Fulfillment Overview",
      todayJobs: "Today's Jobs",
      successRate: "Success Rate",
      totalProfit: "Total Profit",
      pendingApproval: "Pending Approval",
      viewAll: "View All Jobs",
    },
  },
} as const;
