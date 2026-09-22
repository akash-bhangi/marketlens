import "./KeyMetrics.css";

// Formats large values into Indian Crores (e.g., 20154200000000 -> ₹20,15,420 Cr)
function formatMarketCap(val) {
    if (!val) return "N/A";
    const inCrores = val / 10000000;
    return `₹${Math.round(inCrores).toLocaleString("en-IN")} Cr`;
}

// Formats volume (e.g., 6800000 -> 6.8M or Lakhs)
function formatVolume(val) {
    if (!val) return "N/A";
    if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(2)} Lakh`;
    return val.toLocaleString("en-IN");
}

export default function KeyMetrics({ stockData }) {
    if (!stockData) return null;

    return (
        <div className="card key-metrics-card">
            <h3 className="metrics-title">Key Financial Metrics</h3>

            <div className="metrics-grid">
                {/*1. Open*/}
                <div className="metric-item">
                    <span className="metric-label">Open</span>
                    <strong className="metric-value">
                        ₹{stockData.open?.toLocaleString("en-IN") || "—"}
                    </strong>
                </div>

                {/*2. Previous Close*/}
                <div className="metric-item">
                    <span className="metric-label">Previous Close</span>
                    <strong className="metric-value">
                        ₹{stockData.previousClose?.toLocaleString("en-IN") || "—"}
                    </strong>
                </div>

                {/* 3. Day Range */}
                <div className="metric-item">
                    <span className="metric-label">Day Range</span>
                    <strong className="metric-value">
                        ₹{stockData.low?.toLocaleString("en-IN") || "—"} – ₹{stockData.high?.toLocaleString("en-IN") || "—"}
                    </strong>
                </div>

                {/* 4. 52-Week Range */}
                <div className="metric-item">
                    <span className="metric-label">52-Week Range</span>
                    <strong className="metric-value">
                        ₹{stockData.fiftyTwoWeekLow?.toLocaleString("en-IN") || "—"} – ₹{stockData.fiftyTwoWeekHigh?.toLocaleString("en-IN") || "—"}
                    </strong>
                </div>

                {/* 5. Volume */}
                <div className="metric-item">
                    <span className="metric-label">Volume</span>
                    <strong className="metric-value">
                        {formatVolume(stockData.volume)}
                    </strong>
                </div>

                {/* 6. Market Capitalization */}
                <div className="metric-item">
                    <span className="metric-label">Market Capitalization</span>
                    <strong className="metric-value">
                        {formatMarketCap(stockData.marketCap)}
                    </strong>
                </div>
            </div>
        </div>
    );
}