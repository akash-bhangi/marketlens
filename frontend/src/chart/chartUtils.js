// chartUtils.js - Date formatting and calculations for stock charts

export const TIMEFRAMES = ["1D", "1W", "1M", "1Y", "MAX"];

/**
 * Format X-axis tick labels based on active range
 */
export function formatDate(isoString, range) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (range === "1D") {
        return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    }
    if (range === "MAX") {
        return date.getFullYear().toString();
    }
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * Format Tooltip date label with descriptive info
 */
export function formatTooltipDate(isoString, range) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (range === "1D") {
        return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    }
    if (range === "MAX" || range === "1Y") {
        return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * Extract clean single-year ticks for MAX range to avoid duplicate labels
 */
export function getXAxisTicks(history, range) {
    if (range !== "MAX" || !history || history.length === 0) return undefined;
    return history
        .filter((item, index, arr) => {
            const currentYear = new Date(item.date).getFullYear();
            const prevYear = index > 0 ? new Date(arr[index - 1].date).getFullYear() : null;
            return prevYear !== null && currentYear !== prevYear;
        })
        .map(item => item.date);
}

/**
 * Compute performance metrics, colors, and Y-axis domains
 */
export function calculateChartMetrics(history) {
    if (!history || history.length === 0) {
        return {
            startPrice: 0,
            endPrice: 0,
            periodChange: 0,
            periodChangePercent: "0.00",
            isDown: false,
            chartThemeColor: "#10B981",
            candleDomainMin: 0,
            candleDomainMax: 100
        };
    }

    const startPrice = history[0].price ?? 0;
    const endPrice = history[history.length - 1].price ?? 0;
    const periodChange = endPrice - startPrice;
    const periodChangePercent = startPrice > 0 ? ((periodChange / startPrice) * 100).toFixed(2) : "0.00";
    const isDown = history.length > 1 && endPrice < startPrice;
    const chartThemeColor = isDown ? "#EF4444" : "#10B981";

    // Min/Max for Candlestick Y domain
    const minPrice = Math.min(...history.map(d => (typeof d.low === "number" ? d.low : d.price)));
    const maxPrice = Math.max(...history.map(d => (typeof d.high === "number" ? d.high : d.price)));
    const priceDelta = maxPrice - minPrice || 1;
    const candleDomainMin = Number((minPrice - priceDelta * 0.02).toFixed(2));
    const candleDomainMax = Number((maxPrice + priceDelta * 0.02).toFixed(2));

    return {
        startPrice,
        endPrice,
        periodChange,
        periodChangePercent,
        isDown,
        chartThemeColor,
        candleDomainMin,
        candleDomainMax
    };
}
