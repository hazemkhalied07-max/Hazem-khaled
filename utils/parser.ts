import { AlertType, DashboardAlert, UnknownAlert, WeeklyReportData, WeeklyMetric, WeeklyBrandMetric, WeeklyStopper, WeeklyAction, DailyComparisonData, DailyAnomaly, OpsData, LowFulfillmentStore, MissedOrdersData, PendingOrdersData, PickupStatusData, PromoSafeguardData, PromoSafeguardAlert, PromoActionData, PromoActionSection, PromoActionItem, PromoConcentrationData, PromoConcentrationPromo } from '../types';

export const parseDashboardData = (jsonInput: { slack_text: string }[]): DashboardAlert[] => {
  if (!jsonInput || jsonInput.length === 0) return [];
  
  const rawText = jsonInput[0].slack_text;
  
  // Split by bullet point
  const chunks = rawText.split('•').slice(1); // Remove header part before first bullet
  
  const alerts: (DashboardAlert | UnknownAlert)[] = chunks.map((chunk, index) => {
    const lines = chunk.trim().split('\n');
    const titleLine = lines[0];
    const descriptionLine = lines[1] || "";
    const actionLine = lines.find(l => l.includes("Action:")) || "";
    
    // Extract Brand Name
    const brandMatch = titleLine.match(/\*(.*?)\*/);
    const brandName = brandMatch ? brandMatch[1] : "Unknown Brand";
    
    const action = actionLine.replace("- Action:", "").trim();
    const id = `alert-${index}`;

    // STOPPER LOGIC
    if (titleLine.includes('is_stopper')) {
      const ordersMatch = descriptionLine.match(/dropped from (\d+) last month to (\d+)/);
      const prev = ordersMatch ? parseInt(ordersMatch[1]) : 0;
      const curr = ordersMatch ? parseInt(ordersMatch[2]) : 0;
      
      return {
        id,
        brandName,
        type: AlertType.STOPPER,
        previousOrders: prev,
        currentOrders: curr,
        rawText: descriptionLine,
        action
      } as DashboardAlert;
    }

    // GMV LOGIC
    if (titleLine.includes('gmv_delta_pct')) {
      const gmvMatch = descriptionLine.match(/declined by ([\d\.]+)% from \$([\d,\.]+) to \$([\d,\.]+)/);
      const pct = gmvMatch ? parseFloat(gmvMatch[1]) : 0;
      const prev = gmvMatch ? parseFloat(gmvMatch[2].replace(/,/g, '')) : 0;
      const curr = gmvMatch ? parseFloat(gmvMatch[3].replace(/,/g, '')) : 0;

      return {
        id,
        brandName,
        type: AlertType.GMV_DECLINE,
        declinePercentage: pct,
        previousGMV: prev,
        currentGMV: curr,
        rawText: descriptionLine,
        action
      } as DashboardAlert;
    }

    // PROMO LOGIC
    if (titleLine.includes('promo_delta_pp')) {
      const promoMatch = descriptionLine.match(/increased by ([\d\.]+) percentage points \(([\d\.]+)% → ([\d\.]+)%\)/);
      const points = promoMatch ? parseFloat(promoMatch[1]) : 0;
      const prev = promoMatch ? parseFloat(promoMatch[2]) : 0;
      const curr = promoMatch ? parseFloat(promoMatch[3]) : 0;

      return {
        id,
        brandName,
        type: AlertType.PROMO_SPIKE,
        increasePoints: points,
        previousRate: prev,
        currentRate: curr,
        rawText: descriptionLine,
        action
      } as DashboardAlert;
    }

    return {
      id,
      brandName,
      type: AlertType.UNKNOWN,
      rawText: descriptionLine,
      action
    } as UnknownAlert;

  });

  return alerts.filter((a): a is DashboardAlert => a.type !== AlertType.UNKNOWN);
};

export const calculateMetrics = (alerts: DashboardAlert[]) => {
    let ordersLost = 0;
    let gmvAtRisk = 0;
    let stopperCount = 0;

    alerts.forEach(alert => {
        if (alert.type === AlertType.STOPPER) {
            ordersLost += (alert.previousOrders - alert.currentOrders);
            stopperCount++;
        }
        if (alert.type === AlertType.GMV_DECLINE) {
            gmvAtRisk += (alert.previousGMV - alert.currentGMV);
        }
    });

    return {
        ordersLost,
        gmvAtRisk,
        stopperCount,
        totalAlerts: alerts.length
    };
};

export const parseWeeklyData = (jsonInput: { text: string }[]): WeeklyReportData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;

  const raw = jsonInput[0].text;
  const lines = raw.split('\n');

  // Helper to extract lines between headers
  const getSection = (header: string, nextHeader: string | null) => {
    const startIndex = lines.findIndex(l => l.includes(header));
    if (startIndex === -1) return [];
    
    let endIndex = lines.length;
    if (nextHeader) {
      const nextIndex = lines.findIndex((l, i) => i > startIndex && l.includes(nextHeader));
      if (nextIndex !== -1) endIndex = nextIndex;
    }
    
    return lines.slice(startIndex + 1, endIndex).filter(l => l.trim() !== "");
  };

  // 1. Window
  const windowLine = lines.find(l => l.includes("Window:")) || "";
  const window = windowLine.replace("Window:", "").trim();

  // 2. Totals
  const parseMetric = (line: string): WeeklyMetric => {
    const parts = line.split('vs');
    const labelVal = parts[0].split(':');
    const val = labelVal[1]?.trim();
    
    const rightSide = parts[1] || "";
    const prevMatch = rightSide.match(/^([^\(]+)/);
    const prev = prevMatch ? prevMatch[1].trim() : "";

    const parenthesisMatch = rightSide.match(/\((.*?)\)/);
    const parenthesisContent = parenthesisMatch ? parenthesisMatch[1] : "";
    
    let delta = "";
    let percent = "";
    
    if (parenthesisContent.includes('|')) {
       const splitParen = parenthesisContent.split('|');
       delta = splitParen[0].trim();
       percent = splitParen[1].trim();
    } else {
       delta = parenthesisContent.trim();
    }

    const isNegative = delta.includes('-');
    const trend = isNegative ? 'down' : 'up';

    return {
      value: val,
      previous: prev,
      delta: delta,
      percentChange: percent,
      trend
    };
  };

  const totalLines = getSection('*TOTAL*', '*Key takeaways*');
  const totals = {
    orders: parseMetric(totalLines.find(l => l.startsWith('Orders')) || ""),
    gmv: parseMetric(totalLines.find(l => l.startsWith('GMV')) || ""),
    ats: parseMetric(totalLines.find(l => l.startsWith('ATS')) || ""),
    promo: parseMetric(totalLines.find(l => l.startsWith('Promo')) || ""),
  };

  // 3. Takeaways
  const takeawayLines = getSection('*Key takeaways*', '*Top GMV Gainers*');
  const takeaways = takeawayLines.map(l => l.replace(/^- /, '').trim());

  // 4. Gainers & Decliners
  const parseBrandList = (lines: string[]): WeeklyBrandMetric[] => {
    return lines.map((line, idx) => {
      const regex = /^\d+\) (.*?): (.*?) GMV — (.*)/;
      const match = line.match(regex);
      if (!match) return null;
      return {
        id: `brand-${idx}`,
        rank: idx + 1,
        name: match[1],
        gmvChange: match[2],
        description: match[3]
      };
    }).filter((x): x is WeeklyBrandMetric => x !== null);
  };

  const gainerLines = getSection('*Top GMV Gainers*', '*Top GMV Decliners*');
  const declinerLines = getSection('*Top GMV Decliners*', '*Stoppers*');

  const gainers = parseBrandList(gainerLines);
  const decliners = parseBrandList(declinerLines);

  // 5. Stoppers
  const stopperLines = getSection('*Stoppers*', '*P0 Actions (Today)*');
  const stoppers: WeeklyStopper[] = stopperLines.map((line, idx) => {
    const regex = /- (.*?): LW Orders=(\d+), GMV=(.*)/;
    const match = line.match(regex);
    if (!match) return null;
    return {
      id: `stopper-${idx}`,
      name: match[1],
      lwOrders: parseInt(match[2]),
      lwGmv: match[3]
    };
  }).filter((x): x is WeeklyStopper => x !== null);

  // 6. Actions
  const parseActions = (lines: string[]): WeeklyAction[] => {
    return lines.map((line, idx) => {
      const regex = /- \((.*?)\) (.*?) \| KPI: (.*)/;
      const match = line.match(regex);
      if (!match) return null;
      return {
        id: `action-${idx}`,
        owner: match[1],
        task: match[2],
        kpi: match[3]
      };
    }).filter((x): x is WeeklyAction => x !== null);
  };

  const p0Lines = getSection('*P0 Actions (Today)*', '*P1 Actions (This Week)*');
  const p1Lines = getSection('*P1 Actions (This Week)*', null);

  return {
    window,
    totals,
    takeaways,
    gainers,
    decliners,
    stoppers,
    actions: {
      p0: parseActions(p0Lines),
      p1: parseActions(p1Lines)
    }
  };
};

export const parseDailyComparisonData = (jsonInput: { text: string }[]): DailyComparisonData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const raw = jsonInput[0].text;
  const lines = raw.split('\n');

  const getSection = (header: string, nextHeader: string | null) => {
    const startIndex = lines.findIndex(l => l.includes(header));
    if (startIndex === -1) return [];
    
    let endIndex = lines.length;
    if (nextHeader) {
      const nextIndex = lines.findIndex((l, i) => i > startIndex && l.includes(nextHeader));
      if (nextIndex !== -1) endIndex = nextIndex;
    }
    
    return lines.slice(startIndex + 1, endIndex).filter(l => l.trim() !== "");
  };

  // 1. Generated Date
  const generatedLine = lines.find(l => l.includes("_Generated:")) || "";
  const generatedAt = generatedLine.replace("_Generated:", "").replace("_", "").trim();

  // 2. Headline
  const headlineLine = lines.find(l => l.includes("*Headline:*")) || "";
  const headline = headlineLine.replace("*Headline:*", "").trim();

  // 3. Insights
  const insightLines = getSection("*Insights:*", "*Anomalies:*");
  const insights = insightLines.map(l => l.replace(/^[•-]\s*/, '').trim());

  // 4. Anomalies
  const anomalyLines = getSection("*Anomalies:*", null);
  const anomalies: DailyAnomaly[] = anomalyLines.map((line, idx) => {
    const match = line.match(/^[•-]\s*\*(.*?)\*:\s*(.*)/);
    if (!match) return null;
    return {
      id: `anomaly-${idx}`,
      metric: match[1],
      description: match[2]
    };
  }).filter((x): x is DailyAnomaly => x !== null);

  return {
    generatedAt,
    headline,
    insights,
    anomalies
  };
};

export const parseOpsData = (jsonInput: any[]): OpsData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const item = jsonInput[0];
  return {
    date: item.date,
    fulfillmentRate: parseFloat(item.fullfilmentrate),
    missedOrders: parseInt(item.missedorders),
    pendingOrders: parseInt(item.today_pending_orders)
  };
};

export const parseLowFulfillmentData = (jsonInput: { text: string }[]): LowFulfillmentStore[] => {
  if (!jsonInput || jsonInput.length === 0) return [];
  const rawText = jsonInput[0].text;
  const lines = rawText.split('\n');
  
  return lines.map((line, index) => {
    const regex = /^\*(\d+)\)\*?\s+(.*?) — Missed: \*(.*?)\* \| FR: (.*?)%/;
    const match = line.match(regex);
    if (!match) return null;
    
    return {
      id: `store-${index}`,
      rank: parseInt(match[1]),
      name: match[2].trim(),
      missedOrders: parseInt(match[3]),
      fulfillmentRate: parseFloat(match[4])
    };
  }).filter((x): x is LowFulfillmentStore => x !== null);
};

export const parseMissedOrdersBreakdown = (jsonInput: { text: string }[]): MissedOrdersData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const rawText = jsonInput[0].text;
  
  const dateMatch = rawText.match(/\((.*?)\)/);
  const date = dateMatch ? dateMatch[1] : "Unknown Date";

  const totalMatch = rawText.match(/Total placed: \*(\d+)\*/);
  const pickedMatch = rawText.match(/Picked: \*(\d+)\*/);
  const pendingMatch = rawText.match(/Pending: \*(\d+)\*/);

  const reasons: { reason: string; count: number }[] = [];
  const reasonsSection = rawText.split('*Missed reasons (counts):*')[1];
  
  if (reasonsSection) {
      const reasonLines = reasonsSection.trim().split('\n');
      reasonLines.forEach(line => {
          const match = line.match(/• (.*?): \*(\d+)\*/);
          if (match) {
              reasons.push({
                  reason: match[1].trim(),
                  count: parseInt(match[2])
              });
          }
      });
  }

  return {
    date,
    totalPlaced: totalMatch ? parseInt(totalMatch[1]) : 0,
    picked: pickedMatch ? parseInt(pickedMatch[1]) : 0,
    pending: pendingMatch ? parseInt(pendingMatch[1]) : 0,
    reasons
  };
};

export const parsePendingOrdersData = (jsonInput: any[]): PendingOrdersData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const data = jsonInput[0];
  return {
    totalPending: data.totalPending,
    brandCount: data.rowsCount,
    topBrands: data.top.map((item: any) => ({
      brandName: item.brand_name,
      pendingOrders: item.pending_orders
    }))
  };
};

export const parsePickupStatusData = (jsonInput: any[]): PickupStatusData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const item = jsonInput[0];
  return {
    generatedAt: item.generated_at,
    brands: item.closed_brands || [],
    rawText: item.slack_text
  };
};

export const parsePromoSafeguardData = (jsonInput: { slack_text: string }[]): PromoSafeguardData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const rawText = jsonInput[0].slack_text;
  
  const lines = rawText.split('\n').filter(l => l.trim() !== "");
  const title = lines[0].replace(/\*/g, '').trim();
  const summary = lines[1] ? lines[1].trim() : "";
  
  // Parse Alerts
  const alerts: PromoSafeguardAlert[] = [];
  
  // Robust regex that handles:
  // - Various bullet types (•, *, -)
  // - Various dash types (—, -)
  // - Numbers with or without commas
  const regex = /^[•\-*]\s+\*(.*?)\*\s+[—\-\u2014]\s+(.*?)\s+\|\s+burn\s+\$([\d,.]+)\s+\|\s+burn\/gmv\s+([\d,.]+)%\s+\|\s+share\s+([\d,.]+)%\s+\|\s+orders\s+(\d+)\s+\|\s+(.*)/;
  
  lines.forEach((line, idx) => {
      const trimmed = line.trim();
      const match = trimmed.match(regex);
      if (match) {
          alerts.push({
              id: `promo-alert-${idx}`,
              status: match[1],
              brandName: match[2],
              burnAmount: parseFloat(match[3].replace(/,/g, '')),
              burnGmvRatio: parseFloat(match[4].replace(/,/g, '')),
              share: parseFloat(match[5].replace(/,/g, '')),
              orders: parseInt(match[6].replace(/,/g, '')),
              reason: match[7]
          });
      }
  });

  return {
      title,
      summary,
      alerts
  };
};

export const parsePromoActionData = (jsonInput: { slack_text: string }[]): PromoActionData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const rawText = jsonInput[0].slack_text;
  const lines = rawText.split('\n');

  // 1. Title
  const title = lines[0].replace(/\*/g, '').trim();

  // 2. Totals
  const totalLine = lines.find(l => l.includes('*TOTAL:*')) || "";
  const burnMatch = totalLine.match(/burn \$([\d,.]+)/);
  const gmvMatch = totalLine.match(/gmv \$([\d,.]+)/);
  const burnGmvMatch = totalLine.match(/burn\/gmv ([\d.]+)%/);

  const totals = {
    burn: burnMatch ? parseFloat(burnMatch[1].replace(/,/g, '')) : 0,
    gmv: gmvMatch ? parseFloat(gmvMatch[1].replace(/,/g, '')) : 0,
    burnGmvRatio: burnGmvMatch ? parseFloat(burnGmvMatch[1]) : 0
  };

  // 3. Sections (P0, P1, etc.)
  const sections: PromoActionSection[] = [];
  let currentSection: PromoActionSection | null = null;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    // Check for section header
    if (trimmed.startsWith('*P') && trimmed.endsWith('*')) {
       if (currentSection) sections.push(currentSection);
       currentSection = {
         title: trimmed.replace(/\*/g, '').trim(),
         items: []
       };
    } 
    // Check for item line (starts with bullet)
    else if ((trimmed.startsWith('•') || trimmed.startsWith('-')) && currentSection) {
       const parts = trimmed.split('|').map(p => p.trim());
       if (parts.length >= 6) {
           const code = parts[0].replace(/^[•\-]\s*/, '').replace(/`/g, '').trim();
           const burn = parseFloat(parts[1].replace('burn $', '').replace(/,/g, ''));
           const burnGmv = parseFloat(parts[2].replace('burn/gmv', '').replace('%', ''));
           const orders = parseInt(parts[3].replace('orders', ''));
           
           // Handle delta symbol robustly (stripping non-numeric/dot chars)
           const deltaStr = parts[4].replace(/[^\d\.]/g, '');
           const deltaPp = deltaStr ? parseFloat(deltaStr) : 0;
           
           const recommendation = parts[5];

           currentSection.items.push({
             id: `promo-action-${idx}`,
             code,
             burnAmount: isNaN(burn) ? 0 : burn,
             burnGmv: isNaN(burnGmv) ? 0 : burnGmv,
             orders: isNaN(orders) ? 0 : orders,
             deltaPp: isNaN(deltaPp) ? 0 : deltaPp,
             recommendation
           });
       }
    }
  });
  
  if (currentSection) sections.push(currentSection);

  return {
    title,
    totals,
    sections
  };
};

export const parsePromoConcentrationData = (jsonInput: { slack_text: string }[]): PromoConcentrationData | null => {
  if (!jsonInput || jsonInput.length === 0) return null;
  const rawText = jsonInput[0].slack_text;
  const lines = rawText.split('\n').filter(l => l.trim() !== "");

  // 1. Title (first line)
  const title = lines[0].replace(/\*/g, '').trim();
  // 2. Summary (second line)
  const summary = lines[1] ? lines[1].trim() : "";

  const promos: PromoConcentrationPromo[] = [];
  let currentPromo: PromoConcentrationPromo | null = null;

  // Regex for Promo header line: *KW30* — promo burn $676.88 | top5 share 88.99%
  const promoHeaderRegex = /^\*(.*?)\*\s+[—\-\u2014]\s+promo burn\s+\$([\d,.]+)\s+\|\s+top5 share\s+([\d,.]+)%/;
  
  // Regex for Store line: • Exclude/Cap — Modern Supply (store_id: ...) | burn $311.31 | share 45.99%
  const storeRegex = /^[•\-*]\s+(.*?)\s+[—\-\u2014]\s+(.*?)\s+\(store_id:\s+(.*?)\)\s+\|\s+burn\s+\$([\d,.]+)\s+\|\s+share\s+([\d,.]+)%/;

  lines.forEach((line, idx) => {
     const trimmed = line.trim();
     
     // Check for promo header
     const promoMatch = trimmed.match(promoHeaderRegex);
     if (promoMatch) {
         if (currentPromo) promos.push(currentPromo);
         currentPromo = {
             id: `concentration-promo-${idx}`,
             promoCode: promoMatch[1],
             totalBurn: parseFloat(promoMatch[2].replace(/,/g, '')),
             top5Share: parseFloat(promoMatch[3].replace(/,/g, '')),
             stores: []
         };
         return;
     }

     // Check for store line
     const storeMatch = trimmed.match(storeRegex);
     if (storeMatch && currentPromo) {
         currentPromo.stores.push({
             id: `concentration-store-${idx}`,
             action: storeMatch[1],
             storeName: storeMatch[2],
             storeId: storeMatch[3],
             burnAmount: parseFloat(storeMatch[4].replace(/,/g, '')),
             share: parseFloat(storeMatch[5].replace(/,/g, ''))
         });
     }
  });

  if (currentPromo) promos.push(currentPromo);

  return {
      title,
      summary,
      promos
  };
};