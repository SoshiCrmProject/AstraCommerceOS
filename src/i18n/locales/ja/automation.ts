export default {
  automation: {
    title: "自動化",
    subtitle: "ドロップシッピングワークフローを自動化",
    
    // Settings page
    settings: {
      title: "自動フルフィルメント設定",
      subtitle: "Amazon自動購入を設定",
      enableLabel: "自動フルフィルメントを有効化",
      enableDescription: "Shopee注文受信時にAmazonから自動的に商品を購入",
      
      profitSettings: "利益設定",
      minProfitLabel: "最小予想利益",
      minProfitDescription: "この金額以上の利益がある注文のみ処理",
      minProfitPlaceholder: "例: 500",
      
      shippingSettings: "配送設定",
      maxDeliveryLabel: "最大配送日数",
      maxDeliveryDescription: "Amazon配送がこれより長い場合は注文を拒否",
      maxDeliveryPlaceholder: "例: 7",
      
      includePointsLabel: "Amazonポイントを利益に含める",
      includePointsDescription: "利益計算時にAmazon報酬ポイントを収益としてカウント",
      
      includeDomesticLabel: "国内配送料を含める",
      includeDomesticDescription: "利益計算に国内配送料を含める",
      
      amazonCredentials: "Amazon認証情報",
      amazonEmailLabel: "Amazonメールアドレス",
      amazonEmailPlaceholder: "your-amazon-email@example.com",
      amazonPasswordLabel: "Amazonパスワード",
      amazonPasswordPlaceholder: "Amazonパスワードを入力",
      amazonTotpLabel: "2FA秘密鍵（オプション）",
      amazonTotpDescription: "二要素認証用のTOTP秘密鍵",
      
      channelFilters: "チャネルフィルター",
      eligibleChannelsLabel: "対象チャネル",
      eligibleChannelsDescription: "自動フルフィルメントを監視するショップを選択",
      allChannelsLabel: "すべてのチャネル",
      
      riskSettings: "リスク管理",
      maxDailyOrdersLabel: "1日の最大注文数",
      maxDailyOrdersDescription: "検出を避けるため、1日の自動注文数を制限",
      maxDailyOrdersPlaceholder: "例: 10",
      
      requireApprovalLabel: "手動承認が必要",
      requireApprovalDescription: "購入前に手動レビューのため注文を保留",
      
      shopeeSettings: "Shopee設定",
      commissionRateLabel: "Shopee手数料率",
      commissionRateDescription: "Shopeeの手数料パーセンテージ（デフォルト: 5%）",
      commissionRatePlaceholder: "5",
      
      saveButton: "設定を保存",
      cancelButton: "キャンセル",
      saveSuccess: "設定を保存しました",
      saveError: "設定の保存に失敗しました",
      
      warning: "⚠️ 警告: 自動購入はAmazonの利用規約に違反する可能性があります",
      warningDetails: "ブラウザ自動化を使用してAmazonから購入すると、アカウント停止のリスクがあります。自己責任で使用してください。",
      acknowledgeLabel: "リスクを理解し、続行することに同意します",
    },
    
    // Jobs page
    jobs: {
      title: "自動フルフィルメントジョブ",
      subtitle: "自動購入を監視・管理",
      
      filters: "フィルター",
      statusFilter: "ステータス",
      allStatuses: "すべてのステータス",
      dateFilter: "期間",
      searchPlaceholder: "注文ID、ASINで検索...",
      
      table: {
        jobId: "ジョブID",
        orderId: "注文ID",
        sku: "SKU",
        asin: "ASIN",
        quantity: "数量",
        shopeePrice: "Shopee価格",
        amazonCost: "Amazonコスト",
        profit: "利益",
        status: "ステータス",
        createdAt: "作成日時",
        actions: "アクション",
      },
      
      status: {
        pending: "保留中",
        evaluating: "評価中",
        approved: "承認済み",
        purchasing: "購入中",
        completed: "完了",
        failed: "失敗",
        rejected: "却下",
      },
      
      actions: {
        view: "詳細を表示",
        retry: "再試行",
        approve: "承認",
        cancel: "キャンセル",
      },
      
      details: {
        title: "ジョブ詳細",
        orderInfo: "注文情報",
        profitBreakdown: "利益内訳",
        amazonDetails: "Amazon詳細",
        errorLog: "エラーログ",
        
        shopeeRevenue: "Shopee収益",
        shopeeCommission: "Shopee手数料",
        amazonPrice: "Amazon価格",
        amazonShipping: "Amazon配送料",
        amazonTax: "Amazon税",
        amazonPoints: "Amazonポイント",
        totalCost: "合計コスト",
        netProfit: "純利益",
        
        retryButton: "購入を再試行",
        approveButton: "購入を承認",
        cancelButton: "ジョブをキャンセル",
      },
      
      empty: "自動フルフィルメントジョブがありません",
      emptyDescription: "注文が処理されるとジョブがここに表示されます",
    },
    
    // Mappings page
    mappings: {
      title: "商品マッピング",
      subtitle: "ShopeeとAmazon商品のマッピングを管理",
      
      addButton: "マッピングを追加",
      importButton: "CSVインポート",
      exportButton: "エクスポート",
      
      table: {
        shopeeSku: "Shopee SKU",
        shopeeProduct: "Shopee商品",
        amazonAsin: "Amazon ASIN",
        amazonProduct: "Amazon商品",
        mappingType: "タイプ",
        confidence: "信頼度",
        status: "ステータス",
        lastVerified: "最終確認日",
        actions: "アクション",
      },
      
      mappingType: {
        manual: "手動",
        automatic: "自動",
        verified: "確認済み",
      },
      
      verificationStatus: {
        pending: "保留中",
        verified: "確認済み",
        failed: "失敗",
      },
      
      actions: {
        edit: "編集",
        verify: "確認",
        delete: "削除",
        viewAmazon: "Amazonで表示",
      },
      
      addModal: {
        title: "商品マッピングを追加",
        shopeeSkuLabel: "Shopee SKU",
        shopeeSkuPlaceholder: "Shopee SKUを入力",
        amazonAsinLabel: "Amazon ASIN",
        amazonAsinPlaceholder: "Amazon ASINを入力（例: B08N5WRWNW）",
        amazonUrlLabel: "Amazon URL（オプション）",
        amazonUrlPlaceholder: "https://www.amazon.com/...",
        confidenceLabel: "信頼度スコア",
        saveButton: "マッピングを追加",
        cancelButton: "キャンセル",
      },
      
      empty: "商品マッピングがありません",
      emptyDescription: "Shopee商品とAmazonを紐付けるマッピングを追加",
    },
    
    // Dashboard widget
    overview: {
      title: "自動フルフィルメント概要",
      todayJobs: "今日のジョブ",
      successRate: "成功率",
      totalProfit: "合計利益",
      pendingApproval: "承認待ち",
      viewAll: "すべてのジョブを表示",
    },
  },
} as const;
