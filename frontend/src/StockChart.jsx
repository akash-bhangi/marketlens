import { useState, useEffect } from 'react';
import './StockChart.css';
import { calculateChartMetrics } from './chart/chartUtils';
import ChartHeader from './chart/ChartHeader';
import AreaChartView from './chart/AreaChartView';
import CandlestickChartView from './chart/CandlestickChartView';

export default function StockChart({ symbol }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [range, setRange] = useState('1M');
    const [chartType, setChartType] = useState('area'); // 'area' | 'candle'

    useEffect(() => {
        async function fetchStockHistory() {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stock/${symbol}/history?range=${range}`);
                const data = await response.json();
                setHistory(Array.isArray(data) ? data : []);
            }
            catch (error) {
                console.error("Error fetching stock history:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStockHistory();
    }, [symbol, range]);

    const {
        periodChange,
        periodChangePercent,
        isDown,
        chartThemeColor,
        candleDomainMin,
        candleDomainMax
    } = calculateChartMetrics(history);

    return (
        <>
            {isLoading ? (
                <div className="card stock-chart-card chart-loading">
                    <p>Loading please wait</p>
                </div>
            ) : (
                <div className="card stock-chart-card">
                    <ChartHeader
                        range={range}
                        setRange={setRange}
                        chartType={chartType}
                        setChartType={setChartType}
                        periodChange={periodChange}
                        periodChangePercent={periodChangePercent}
                        isDown={isDown}
                        hasHistory={history.length > 1}
                    />

                    <div className="chart-container">
                        {history.length === 0 ? (
                            <p className="chart-no-data">No chart data available</p>
                        ) : chartType === "candle" ? (
                            <CandlestickChartView
                                history={history}
                                range={range}
                                candleDomainMin={candleDomainMin}
                                candleDomainMax={candleDomainMax}
                            />
                        ) : (
                            <AreaChartView
                                history={history}
                                range={range}
                                isDown={isDown}
                                chartThemeColor={chartThemeColor}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}