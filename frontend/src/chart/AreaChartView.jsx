// AreaChartView.jsx - Area line chart with dynamic red/green colors
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";
import { formatDate, formatTooltipDate, getXAxisTicks } from './chartUtils';

export default function AreaChartView({ history, range, isDown, chartThemeColor }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="date"
                    ticks={getXAxisTicks(history, range)}
                    tickFormatter={(val) => formatDate(val, range)}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={range === "MAX" ? 0 : 35}
                />
                <YAxis
                    domain={["auto", "auto"]}
                    orientation="right"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val.toLocaleString("en-IN")}`}
                />
                <Tooltip
                    labelFormatter={(label) => formatTooltipDate(label, range)}
                    formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Price"]}
                    contentStyle={{
                        backgroundColor: "#111827",
                        borderRadius: "8px",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "0.85rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)"
                    }}
                    itemStyle={{ color: chartThemeColor, fontWeight: "600" }}
                />
                <Area
                    type="monotone"
                    dataKey="price"
                    stroke={chartThemeColor}
                    strokeWidth={2.5}
                    fill={`url(#${isDown ? "redGradient" : "greenGradient"})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
