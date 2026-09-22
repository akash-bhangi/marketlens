// CandlestickChartView.jsx - Candlestick (OHLC) chart rendering
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";
import { formatDate, getXAxisTicks, isFiveYearRange } from './chartUtils';
import CandlestickShape from './CandlestickShape';
import CandlestickTooltip from './CandlestickTooltip';

export default function CandlestickChartView({
    history,
    range,
    candleDomainMin,
    candleDomainMax
}) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                    dataKey="date"
                    ticks={getXAxisTicks(history, range)}
                    tickFormatter={(val) => formatDate(val, range)}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={isFiveYearRange(range) ? 0 : 35}
                />
                <YAxis
                    domain={[candleDomainMin, candleDomainMax]}
                    orientation="right"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val.toLocaleString("en-IN")}`}
                />
                <Tooltip content={(props) => <CandlestickTooltip {...props} range={range} />} />
                <Bar
                    dataKey="close"
                    shape={<CandlestickShape domainMin={candleDomainMin} domainMax={candleDomainMax} />}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
