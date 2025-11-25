# Auto-Fulfillment Feature Implementation Plan

## Overview
Automated dropshipping system that monitors Shopee orders and automatically purchases matching products from Amazon using headless browser automation.

## Architecture

### 1. Components

#### A. Order Monitor Service
- Listen to Shopee webhook for new orders
- Store orders in `Order` table with `autoFulfillmentEligible` flag
- Queue orders for fulfillment processing

#### B. Product Matching Engine
- Map Shopee product SKU → Amazon ASIN
- Search Amazon if no mapping exists
- Use web scraping to get real-time price/availability

#### C. Profit Calculator
- Calculate: `Profit = ShopeePrice - (AmazonPrice + ShopeeCommission + ShippingFee - AmazonPoints)`
- Apply filters: minimum profit, maximum shipping days
- Mark order as eligible/ineligible

#### D. Headless Browser Automation
- **Puppeteer** or **Playwright** for browser control
- Amazon login with session persistence
- Add to cart automation
- Checkout automation with saved payment
- Handle CAPTCHA/2FA

#### E. Fulfillment Queue Worker
- Process eligible orders
- Execute Amazon purchase
- Update order status
- Log errors for manual review

### 2. Database Schema Extensions

```prisma
model AutoFulfillmentJob {
  id              String   @id @default(uuid())
  orgId           String
  organization    Organization @relation(fields: [orgId], references: [id])
  
  orderId         String
  order           Order    @relation(fields: [orderId], references: [id])
  
  // Status tracking
  status          String   @default("pending") // pending, processing, completed, failed, cancelled
  
  // Profit calculation
  shopeePrice     Float
  amazonPrice     Float
  shippingFee     Float
  commission      Float
  amazonPoints    Float    @default(0)
  expectedProfit  Float
  
  // Product matching
  shopeeProductId String
  amazonAsin      String?
  amazonUrl       String?
  
  // Shipping info
  customerAddress Json     // Shopee customer address
  estimatedShippingDays Int?
  
  // Automation details
  attempts        Int      @default(0)
  lastAttemptAt   DateTime?
  errorMessage    String?
  amazonOrderId   String?  // Amazon order number after purchase
  
  // Settings used
  includeAmazonPoints Boolean @default(false)
  includeDomesticShipping Boolean @default(true)
  maxShippingDays Int      @default(7)
  minProfit       Float    @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  completedAt     DateTime?
  
  @@index([orgId, status])
  @@index([orderId])
}

model AutoFulfillmentConfig {
  id              String   @id @default(uuid())
  orgId           String   @unique
  organization    Organization @relation(fields: [orgId], references: [id])
  
  // Feature toggle
  enabled         Boolean  @default(false)
  
  // Amazon credentials
  amazonEmail     String?
  amazonPassword  String?  // Encrypted
  amazonSessionCookies Json? // Store session for reuse
  
  // Profit calculation settings
  includeAmazonPoints Boolean @default(false)
  includeDomesticShipping Boolean @default(true)
  defaultShippingFee Float   @default(0)
  
  // Filtering rules
  maxShippingDays Int      @default(7)
  minProfit       Float    @default(0)
  
  // Shop filters
  enabledShops    Json?    // Array of Shopee shop IDs
  
  // Error handling
  maxRetries      Int      @default(3)
  notifyOnError   Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ProductMapping {
  id              String   @id @default(uuid())
  orgId           String
  organization    Organization @relation(fields: [orgId], references: [id])
  
  // Shopee product
  shopeeProductId String
  shopeeSku       String
  shopeeShopId    String
  
  // Amazon product
  amazonAsin      String
  amazonUrl       String
  
  // Metadata
  lastVerified    DateTime?
  isActive        Boolean  @default(true)
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([orgId, shopeeProductId, amazonAsin])
  @@index([orgId, shopeeSku])
}
```

### 3. Implementation Phases

#### Phase 1: Infrastructure (Week 1)
- [ ] Install Puppeteer/Playwright
- [ ] Create headless browser service
- [ ] Implement Amazon login automation
- [ ] Session management (cookie persistence)
- [ ] CAPTCHA handling setup

#### Phase 2: Order Processing (Week 2)
- [ ] Shopee webhook integration
- [ ] Order queue system (BullMQ/Redis)
- [ ] Product matching logic
- [ ] Profit calculator service
- [ ] Filter engine (profit, shipping days)

#### Phase 3: Amazon Automation (Week 3)
- [ ] Amazon search automation
- [ ] Product page scraping (price, shipping, availability)
- [ ] Add to cart automation
- [ ] Checkout flow automation
- [ ] Payment method handling
- [ ] Order confirmation scraping

#### Phase 4: UI & Monitoring (Week 4)
- [ ] Auto-fulfillment settings page
- [ ] Order dashboard with filters
- [ ] Error log viewer
- [ ] Manual retry interface
- [ ] Analytics (success rate, profit tracking)

### 4. Technical Stack

```json
{
  "dependencies": {
    "puppeteer": "^21.0.0",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "bullmq": "^5.0.0",
    "ioredis": "^5.3.2"
  }
}
```

### 5. Key Files Structure

```
src/
├── lib/
│   ├── automation/
│   │   ├── browser.service.ts          # Headless browser manager
│   │   ├── amazon.scraper.ts           # Amazon-specific automation
│   │   ├── captcha-handler.ts          # CAPTCHA solving
│   │   └── session-manager.ts          # Cookie/session persistence
│   ├── services/
│   │   ├── auto-fulfillment.service.ts # Main orchestration
│   │   ├── profit-calculator.ts        # Profit calculation logic
│   │   ├── product-matcher.ts          # Shopee → Amazon matching
│   │   └── order-processor.ts          # Order queue processing
│   └── queues/
│       └── fulfillment.queue.ts        # BullMQ job definitions
└── app/
    └── [locale]/
        └── app/
            └── automation/
                └── auto-fulfillment/
                    ├── page.tsx                # Settings UI
                    ├── orders/
                    │   └── page.tsx            # Order monitor
                    └── logs/
                        └── page.tsx            # Error logs

```

### 6. Security Considerations

⚠️ **CRITICAL SECURITY REQUIREMENTS:**

1. **Credential Encryption**
   - Encrypt Amazon passwords with AES-256
   - Store encryption key in environment variables
   - Never log credentials

2. **Session Security**
   - Rotate session cookies periodically
   - Implement session validation
   - Handle 2FA gracefully

3. **Rate Limiting**
   - Limit Amazon requests (avoid bot detection)
   - Implement exponential backoff
   - Randomize timing between actions

4. **Legal Compliance**
   - Amazon Terms of Service prohibit automation
   - This feature operates in gray area
   - User assumes all legal responsibility
   - Add disclaimer in UI

### 7. Amazon Bot Detection Evasion

```typescript
// Stealth techniques
- Use puppeteer-extra-plugin-stealth
- Random mouse movements
- Human-like typing delays
- Randomized user agents
- Residential proxies (optional)
- Session reuse (reduce logins)
```

### 8. Error Handling Strategy

| Error Type | Action |
|------------|--------|
| Product unavailable | Skip order, log error |
| Price changed | Recalculate profit, retry if still profitable |
| CAPTCHA | Pause, notify admin, manual solve |
| Payment failed | Retry with different payment method |
| Address invalid | Mark order for manual review |
| Session expired | Re-login, retry |

### 9. Monitoring & Alerts

- **Success Rate Dashboard**: Track % of automated orders
- **Profit Analytics**: Actual vs expected profit
- **Error Notifications**: Email/SMS for critical failures
- **Daily Reports**: Summary of automated orders
- **Stock Monitoring**: Track Amazon availability

### 10. API Endpoints

```
POST   /api/auto-fulfillment/config          # Update settings
GET    /api/auto-fulfillment/jobs             # List jobs
POST   /api/auto-fulfillment/jobs/:id/retry   # Manual retry
GET    /api/auto-fulfillment/errors           # Error log
POST   /api/auto-fulfillment/test             # Test Amazon connection
GET    /api/auto-fulfillment/stats            # Analytics
```

---

## Legal Disclaimer

⚠️ **IMPORTANT**: 
- Amazon's Terms of Service prohibit automated purchasing
- This system may violate Amazon's ToS
- Account suspension risk
- Use at your own legal and financial risk
- Recommend manual review before activation

## Next Steps

1. Confirm requirements and budget
2. Set up development environment (Puppeteer + Redis)
3. Test Amazon automation in isolated environment
4. Implement Phase 1 (browser automation)
5. Beta test with limited orders
6. Deploy to production with monitoring
