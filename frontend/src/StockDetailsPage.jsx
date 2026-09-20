import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./StockDetailsPage.css";

export default function StockDetailsPage() {
    const { symbol } = useParams();
    const [stockData, setStockData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <div className="card stock-details-card">
                    <div className="loading-msg">
                        Loading...Please wait
                    </div>
                </div>
            </div>
        );
    }
    if (error || !stockData) {
        return (
            <div className="stock-details">
                <div className="card stock-details-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                    <div className="error-msg">
                        Error: {error}
                    </div>
                    <Link to="/" className="btn btn-primary" >Go Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="stock-details">
            <div className="card stock-details-card">
                <div className="tags">
                    <span>{stockData?.exchange} - {stockData?.symbol?.split(".")[0]}</span>
                </div>
                <div className="card-header">
                    <h2>{stockData?.name}</h2>
                    <div className="button">
                        <button className="btn btn-primary">Add to Watchlist</button>
                        <button className="btn btn-secondary">Buy Shares</button>
                    </div>
                </div>
                <p className="company-subtitle">{stockData?.summary}</p>
                <div className="current-price">
                    <h2>₹{stockData?.price?.toLocaleString('en-IN')}</h2>
                    <span className={stockData?.change >= 0 ? "positive" : "negative"}>
                        [ {stockData?.change >= 0 ? "+" : ""}{stockData?.change?.toFixed(2)} ({stockData?.changePercent?.toFixed(2)}%)]
                    </span>
                </div>
                <div className="card-body">

                </div>
            </div >
        </div>
    );
}
