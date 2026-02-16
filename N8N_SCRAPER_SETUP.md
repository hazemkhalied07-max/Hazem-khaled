# n8n Workflow - Dar Alamirat (دار الأميرات) Offers Scraper

Automated daily scraper for [daralamirat.com.sa](https://daralamirat.com.sa/) offers and deals.

## Files

| File | Description |
|------|-------------|
| `n8n-daralamirat-scraper.json` | **Basic workflow** - Uses HTTP Request + HTML Extract nodes. Lightweight and fast. |
| `n8n-daralamirat-puppeteer-scraper.json` | **Puppeteer workflow** - Uses headless browser for JavaScript-rendered content. More reliable but requires Puppeteer installed on the n8n server. |

## Which Workflow to Use?

- **Start with the Basic workflow** (`n8n-daralamirat-scraper.json`) - it's simpler and uses less resources
- **Switch to Puppeteer** (`n8n-daralamirat-puppeteer-scraper.json`) if the basic workflow returns empty results (this means the site renders content via JavaScript)

## How to Import

1. Open your n8n instance
2. Go to **Workflows** > **Add Workflow** (or press `Ctrl+O`)
3. Click the **...** menu > **Import from File**
4. Select the JSON file you want to import
5. Click **Save**

## Workflow Overview

### Basic Workflow
```
Schedule Trigger (Daily) ──┬──> Fetch Homepage ──> Extract Offers ──┐
                           │                                        ├──> Combine Data ──> Save JSON
Manual Trigger ────────────┴──> Fetch Offers Page ──> Extract Data ─┘
                                                                        │
                                                                        └──> Check if offers found
                                                                              ├── Yes: Success Summary
                                                                              └── No: Fallback Handler
```

### Puppeteer Workflow
```
Schedule Trigger (Daily) ──┬──> Puppeteer Scraper ──> Convert to JSON ──> Save to Disk ──> Summary
                           │
Manual Trigger ────────────┘
```

## Data Extracted

For each offer, the scraper collects:

| Field | Description |
|-------|-------------|
| `title` | Product/offer name |
| `current_price` | Sale/current price (SAR) |
| `original_price` | Original price before discount |
| `discount_percent` | Discount percentage |
| `image_url` | Product image URL |
| `product_link` | Direct link to the product |
| `source_page` | Which page it was scraped from |
| `scraped_at` | Timestamp of scraping |

## Output

Offers are saved as JSON files to `/tmp/daralamirat_offers_YYYY-MM-DD.json`

Example output structure:
```json
{
  "website": "daralamirat.com.sa",
  "website_name": "دار الأميرات - Dar Alamirat",
  "scrape_date": "2026-02-16T12:00:00.000Z",
  "total_offers_found": 25,
  "offers": [
    {
      "title": "Product Name",
      "current_price": "99 SAR",
      "original_price": "199 SAR",
      "discount_percent": "50%",
      "image_url": "https://daralamirat.com.sa/images/product.jpg",
      "product_link": "https://daralamirat.com.sa/product/123",
      "source_page": "homepage",
      "scraped_at": "2026-02-16T12:00:00.000Z"
    }
  ]
}
```

## Customization Tips

### Change Schedule
Edit the "Daily Schedule Trigger" node to adjust frequency (hourly, every 6 hours, etc.)

### Add Email Notifications
Add an **Email Send** node after the "Success Summary" to receive daily offer reports.

### Save to Google Sheets
Replace the "Save JSON to Disk" node with a **Google Sheets** node to append offers to a spreadsheet.

### Fine-tune CSS Selectors
After running the workflow once, inspect the actual HTML returned. Update the CSS selectors in the HTML Extract nodes to match the exact structure of daralamirat.com.sa.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 403 Forbidden | The site has bot protection. Use the Puppeteer workflow or add cookies from a browser session. |
| Empty results | The site likely uses JavaScript rendering. Switch to the Puppeteer workflow. |
| Puppeteer not found | Install Puppeteer on your n8n server: `npm install puppeteer` in the n8n directory. |
| Incorrect data | Inspect the site's HTML and update the CSS selectors in the extraction nodes. |
| Timeout errors | Increase the timeout value in the HTTP Request or Puppeteer node settings. |

## Important Notes

- The site (daralamirat.com.sa) has bot protection and returns 403 to basic HTTP requests
- Browser-like headers are already configured in the workflow
- If the site uses Salla platform, you may also try their API at `/api/products`
- Respect the site's `robots.txt` and terms of service
- Avoid running the scraper too frequently to prevent IP blocking
