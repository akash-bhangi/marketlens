const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function getStockQuote(symbol) {
    // Automatically default to NSE (.NS) if no exchange suffix is provided
    const querySymbol = symbol.includes(".") ? symbol.toUpperCase() : `${symbol.toUpperCase()}.NS`;

    const result = await yahooFinance.quote(querySymbol);

    if (!result || !result.regularMarketPrice) {
        throw new Error(`Stock data not found for symbol: ${querySymbol}`);
    }
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
    };
}

async function getStockIndex() {
    const symbols = ["^NSEI", "^BSESN", "^NSEBANK"];
    const quotes = await Promise.all(
        symbols.map(sym => yahooFinance.quote(sym))
    );

    return quotes.map(q => ({
        symbol: q.symbol,
        name: q.shortName,
        price: q.regularMarketPrice,
        change: q.regularMarketChange,
        changePercent: q.regularMarketChangePercent,
    }));

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
module.exports = { getStockQuote, getStockIndex, getSearch }