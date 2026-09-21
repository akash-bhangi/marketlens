// ChartHeader.jsx - Header controls, title, status badges, and selectors
import { TIMEFRAMES } from './chartUtils';

export default function ChartHeader({
    range,
    setRange,
    chartType,
    setChartType,
    periodChange,
    periodChangePercent,
    isDown,
    hasHistory
}) {
    return (
        <div className="chart-header">
            {/* Top row: Title and Status Badges */}
            <div className="chart-header-top">
                <div className="chart-title-group">
                    <h3 className="chart-title">Interactive Price Chart</h3>
                    <span className="chart-badge-live">LIVE</span>
                    {hasHistory && (
                        <span className={`chart-badge-return ${isDown ? "negative" : "positive"}`}>
                            {isDown ? "▼" : "▲"} {periodChange >= 0 ? "+" : ""}{periodChange.toFixed(2)} ({periodChangePercent}%)
                        </span>
                    )}
                </div>
            </div>

            {/* Controls row: View switcher on left, Timeframe buttons on right */}
            <div className="chart-controls-row">
                <div className="chart-type-selector">
                    <button
                        type="button"
                        onClick={() => setChartType("area")}
                        className={`chart-type-btn ${chartType === "area" ? "active" : ""}`}
                        title="Line View"
                    >
                        📈 Line
                    </button>
                    <button
                        type="button"
                        onClick={() => setChartType("candle")}
                        className={`chart-type-btn ${chartType === "candle" ? "active" : ""}`}
                        title="Candlestick View"
                    >
                        🕯️ Candles
                    </button>
                </div>

                <div className="timeframe-selector">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setRange(tf)}
                            className={`timeframe-btn ${range === tf ? "active" : ""}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
