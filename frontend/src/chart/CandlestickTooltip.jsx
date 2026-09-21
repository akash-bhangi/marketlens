// CandlestickTooltip.jsx - Custom hover tooltip for candlestick chart
import { formatTooltipDate } from './chartUtils';

export default function CandlestickTooltip({ active, payload, range }) {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    if (!item) return null;

    const isBullish = item.close >= item.open;
    const diff = Number((item.close - item.open).toFixed(2));
    const diffPercent = item.open ? Number(((diff / item.open) * 100).toFixed(2)) : 0;

    return (
        <div className="candle-tooltip">
            <div className="candle-tooltip-date">{formatTooltipDate(item.date, range)}</div>
            <div className="candle-tooltip-grid">
                <span className="candle-tooltip-label">Open:</span>
                <span className="candle-tooltip-val">₹{item.open?.toLocaleString("en-IN")}</span>

                <span className="candle-tooltip-label">High:</span>
                <span className="candle-tooltip-val">₹{item.high?.toLocaleString("en-IN")}</span>

                <span className="candle-tooltip-label">Low:</span>
                <span className="candle-tooltip-val">₹{item.low?.toLocaleString("en-IN")}</span>

                <span className="candle-tooltip-label">Close:</span>
                <span className="candle-tooltip-val">₹{item.close?.toLocaleString("en-IN")}</span>

                <span className="candle-tooltip-label">Change:</span>
                <span className={`candle-tooltip-val ${isBullish ? "positive" : "negative"}`}>
                    {diff >= 0 ? "+" : ""}{diff} ({diffPercent}%)
                </span>
            </div>
        </div>
    );
}
