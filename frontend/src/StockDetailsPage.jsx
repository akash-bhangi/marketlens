import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./StockDetailsPage.css";
import StockChart from "./StockChart";
import KeyMetrics from "./KeyMetrics";
import WatchlistButton from "./WatchlistButton";
import TradeModal from "./TradeModal";

export default function StockDetailsPage({ user }) {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stockData, setStockData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTradeModal, setShowTradeModal] = useState(false);

    useEffect(() => {
        async function fetchDetails() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stock/${symbol}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Something went wrong!");
                }
                setStockData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDetails();
    }, [symbol]);

    if (isLoading) {
        return (
            <div className="stock-details">
                <div className="stock-details-card">
                    <div className="loading-msg">Loading asset details...</div>
                </div>
            </div>
        );
    }
    if (error || !stockData) {
        return (
            <div className="stock-details">
                <div className="stock-details-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                    <div className="error-msg">Error: {error}</div>
                    <Link to="/" className="btn btn-primary">Go Back to Dashboard</Link>
                </div>
            </div>
        );
    }
    const isPositive = (stockData?.change ?? 0) >= 0;

    return (
        <>
            <div className="stock-details">
                <div className="stock-details-card">
                    <div className="tags">
                        <span>{stockData?.exchange || "NSE"} • {stockData?.symbol?.split(".")[0]}</span>
                    </div>
                    <div className="card-header">
                        <h2>{stockData?.name}</h2>
                        <div className="stock-action-buttons">
                            <WatchlistButton stockData={stockData} />
                            <button
                                type="button"
                                className="btn btn-trade "
                                onClick={() => {
                                    setShowTradeModal(true);
                                }}
                                title="Execute paper trade order"
                            >
                                <span>Trade</span>
                            </button>
                        </div>
                    </div>
                    {stockData?.summary && (
                        <p className="company-subtitle">{stockData.summary}</p>
                    )}
                    <div className="current-price">
                        <h2>₹{stockData?.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                        <span className={isPositive ? "positive" : "negative"}>
                            {isPositive ? "▲ +" : "▼ "}{stockData?.change?.toFixed(2)} ({stockData?.changePercent?.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                <div className="chart-and-metrics">
                    <StockChart symbol={stockData.symbol} />
                    <KeyMetrics stockData={stockData} />
                </div>

                {/* Bottom Twin Cards: Analysts Rating & Market News with empty space for user implementation */}
                <div className="analysis-and-news">
                    <div className="analysis">
                        <h2>Analysts Rating</h2>
                        <div className="analysis-empty-space">
                            <p>AI Agent will Provide Rating soon........</p>
                        </div>
                    </div>

                    <div className="news">
                        <h2>Market News</h2>
                        <div className="analysis-empty-space">
                            <p>News will Provide Soon........</p>
                        </div>
                    </div>
                </div>

            </div>
            {showTradeModal && (
                <TradeModal
                    isOpen={showTradeModal}
                    onClose={() => setShowTradeModal(false)}
                    stock={stockData}
                    user={user}

                />
            )}
        </>
    );
}