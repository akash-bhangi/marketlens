const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function getStockQuote(symbol) {

    const querySymbol = symbol.includes(".") ? symbol.toUpperCase() : `${symbol.toUpperCase()}.NS`;

    const [result, profileResult] = await Promise.all([
        yahooFinance.quote(querySymbol),
        yahooFinance.quoteSummary(querySymbol, { modules: ["assetProfile"] }).catch(() => null)
    ]);
    if (!result || !result.regularMarketPrice) {
        throw new Error(`Stock data not found for symbol: ${querySymbol}`);
    }

    const assetProfile = profileResult?.assetProfile || {};

    return {
        symbol: result.symbol,
        name: result.shortName || result.longName,
        price: result.regularMarketPrice,
        change: result.regularMarketChange,
        changePercent: result.regularMarketChangePercent,
        high: result.regularMarketDayHigh,
        low: result.regularMarketDayLow,
        open: result.regularMarketOpen,
        previousClose: result.regularMarketPreviousClose,
        fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: result.fiftyTwoWeekLow,
        volume: result.regularMarketVolume,
        marketCap: result.marketCap,
        currency: result.currency || "INR",
        exchange: result.fullExchangeName || "NSE",
        sector: assetProfile.sector || "General",
        industry: assetProfile.industry || "Conglomerate",
        summary: assetProfile.longBusinessSummary || ""
    };
}

async function getStockIndex() {
    const symbols = ["^NSEI", "^BSESN", "^NSEBANK"];
    const quotes = await Promise.allSettled(
        symbols.map(sym => yahooFinance.quote(sym))
    );

    return quotes
        .filter(q => q.status === "fulfilled")
        .map(q => {
            const data = q.value;
            return ({
                symbol: data.symbol,
                name: data.shortName,
                price: data.regularMarketPrice,
                change: data.regularMarketChange,
                changePercent: data.regularMarketChangePercent,
            });
        });

}

async function getSearch(query) {
    const result = await yahooFinance.search(query, {
        region: 'IN',
        lang: 'en-IN',
        newsCount: 0
    });
    return (result.quotes || [])
        .filter(item => item.isYahooFinance && item.quoteType === "EQUITY")
        .map((item) => ({
            symbol: item.symbol,
            shortName: item.shortname,
            longName: item.longname,
            type: item.quoteType,
            exchange: item.exchange
        }));
}

async function getStockHistory(querySymbol, range) {
    const now = new Date();
    let period1 = new Date();
    let interval = "1d";

    switch (range) {
        case "1D":
            period1.setDate(now.getDate() - 1);
            interval = "5m";
            break;
        case "1W":
            period1.setDate(now.getDate() - 7);
            interval = "15m";
            break;
        case "1M":
            period1.setMonth(now.getMonth() - 1);
            interval = "1d";
            break;
        case "1Y":
            period1.setFullYear(now.getFullYear() - 1);
            interval = "1wk";
            break;
        case "MAX":
            period1.setFullYear(now.getFullYear() - 5);
            interval = "1mo";
            break;
        default:
            period1.setMonth(now.getMonth() - 1);
            interval = "1d";
            break;
    }

    const result = await yahooFinance.chart(querySymbol, {
        period1: period1.toISOString().split("T")[0],
        interval: interval
    });
    if (!result || !result.quotes) {
        return [];
    }

    return result.quotes
        .filter(q => q.close !== null && q.close !== undefined)
        .map(q => {
            const close = Number(q.close.toFixed(2));
            const open = Number((q.open ?? close).toFixed(2));
            const high = Number((q.high ?? Math.max(open, close)).toFixed(2));
            const low = Number((q.low ?? Math.min(open, close)).toFixed(2));
            return {
                date: q.date,
                price: close,
                open,
                high,
                low,
                close
            };
        });
}


module.exports = { getStockQuote, getStockIndex, getSearch, getStockHistory }