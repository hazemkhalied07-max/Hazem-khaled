# Dar Al Amirat - Offers Scraper (n8n Workflow)

Automated n8n workflow to scrape and monitor product offers from [daralamirat.com.sa](https://daralamirat.com.sa).

## Workflow Overview

```
Manual Trigger / Schedule (every 6h)
        |
        ├── Fetch Offers (API - JSON)
        ├── Fetch Offers Page (HTML)
        └── Salla Store API (Fallback)
                |
        ┌───────┴───────┐
        v               v
  Process API      Extract HTML
  Products         Products
        |               |
        └───────┬───────┘
                v
         Merge Results
                |
                v
       Deduplicate & Clean
                |
                v
        Generate Summary
                |
        ┌───────┼───────┐
        v       v       v
     Excel   Google   Slack
     File    Sheets   Notify
```

## Nodes Description

| Node | Purpose |
|------|---------|
| **Manual Trigger** | Run workflow on demand |
| **Run Every 6 Hours** | Scheduled automatic execution |
| **Fetch Offers (API)** | Tries JSON API endpoint |
| **Fetch Offers Page (HTML)** | Fetches HTML offers page |
| **Salla Store API (Fallback)** | Uses Salla platform API as fallback |
| **Extract Products from HTML** | Parses product data from HTML using CSS selectors |
| **Process API Products** | Normalizes JSON API response |
| **Process HTML Products** | Normalizes HTML-extracted data |
| **Merge Results** | Combines results from both approaches |
| **Deduplicate & Clean** | Removes duplicates, cleans data |
| **Generate Summary** | Creates summary report with stats |
| **Export to Excel** | Saves products to .xlsx file |
| **Save to Google Sheets** | (Disabled) Appends to Google Sheets |
| **Notify Slack** | (Disabled) Sends summary to Slack |

## Setup Instructions

### 1. Import the Workflow

1. Open your n8n instance
2. Go to **Workflows** > **Import from File**
3. Select `dar-alamirat-offers-scraper.json`
4. Click **Import**

### 2. Configure Output (Optional)

#### Google Sheets
1. Enable the "Save to Google Sheets" node
2. Set up Google Sheets credentials in n8n
3. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
4. Make sure the sheet has a tab named "Offers"

#### Slack Notifications
1. Enable the "Notify Slack" node
2. Replace the webhook URL with your Slack incoming webhook
3. Or set the `WEBHOOK_URL` environment variable

### 3. Activate

1. Toggle the workflow to **Active**
2. It will run automatically every 6 hours
3. Or click **Execute Workflow** to run manually

## Data Output Format

Each product record contains:

```json
{
  "name": "Product Name",
  "brand": "Brand Name",
  "category": "Category",
  "original_price": "199.00",
  "sale_price": "99.00",
  "discount_percentage": "50%",
  "currency": "SAR",
  "url": "https://daralamirat.com.sa/...",
  "image": "https://...",
  "in_stock": true,
  "scraped_at": "2026-02-16T12:00:00.000Z"
}
```

## Notes

- The site is built on the **Salla** e-commerce platform
- The workflow uses 3 parallel approaches (API, HTML scraping, Salla API) for maximum reliability
- If the site blocks requests (403), you may need to:
  - Add valid session cookies to the HTTP headers
  - Use n8n's built-in proxy settings
  - Consider using a headless browser node (e.g., Puppeteer)
- Disabled nodes (Google Sheets, Slack) need credentials configured before enabling
