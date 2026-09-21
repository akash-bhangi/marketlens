// CandlestickShape.jsx - Custom SVG shape for rendering OHLC candlestick bars

export default function CandlestickShape(props) {
    const { x, width, payload, parentViewBox, domainMin, domainMax } = props;
    if (!payload || typeof payload.open !== "number" || typeof payload.close !== "number") {
        return null;
    }

    const { open, high, low, close } = payload;
    const isBullish = close >= open;
    const color = isBullish ? "#10B981" : "#EF4444";

    const chartY = parentViewBox?.y ?? 10;
    const chartHeight = parentViewBox?.height ?? 270;
    const range = (domainMax ?? 100) - (domainMin ?? 0);
    if (range <= 0) return null;

    // Convert price value to pixel Y coordinate
    const getY = (val) => chartY + ((domainMax - val) / range) * chartHeight;

    const yOpen = getY(open);
    const yClose = getY(close);
    const yHigh = getY(high ?? Math.max(open, close));
    const yLow = getY(low ?? Math.min(open, close));

    const bodyTop = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
    const candleWidth = Math.max(2, Math.min(width * 0.7, 14));
    const candleX = x + (width - candleWidth) / 2;
    const centerX = x + width / 2;

    return (
        <g className="recharts-candlestick-item">
            {/* Upper and Lower Wick */}
            <line
                x1={centerX}
                y1={yHigh}
                x2={centerX}
                y2={yLow}
                stroke={color}
                strokeWidth={1.5}
            />
            {/* Candle Body */}
            <rect
                x={candleX}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                stroke={color}
                rx={1}
            />
        </g>
    );
}
