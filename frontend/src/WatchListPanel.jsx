import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import './WatchListPanel.css';


function WatchListPanel() {
    const [watchlist, setwatchlist] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchWatchlist() {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/watchlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log("Watchlist data from DB:", data);
                const items = data.watchlist || data || [];

                const enrichedItems = await Promise.all(items.map(async (item) => {
                    try {
                        const quoteResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stock/${item.symbol}`);
                        const quoteData = await quoteResponse.json();
                        return {
                            ...item,
                            price: quoteData.price,
                            change: quoteData.change,
                            changePercent: quoteData.changePercent
                        }
                    } catch (error) {
                        console.log(`Error fetching quote for ${item.symbol}:`, error);
                    }
                    return item;
                }))
                setwatchlist(enrichedItems);
                console.log("Enriched Watchlist:", enrichedItems);
            } catch (error) {
                console.log("Error Fetching Watchlist:", error);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchWatchlist();
    }, [token]);

    async function handleDelete(e, stockId) {
        e.stopPropagation();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/watchlist/${stockId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to delete from watchlist");
            }
            setwatchlist(watchlist.filter(item => item._id !== stockId));
        } catch (error) {
            console.log("Error deleting from watchlist:", error);
            alert("Error deleting from watchlist");
        }
    }

    return (
        <article className="watchlist">
            <h3 className="eyebrow">Your watchlist</h3>
            {
                !token ? (
                    <div className="watchlist-empty-state">
                        <p className="watchlist-state-icon">🔒</p>
                        <h4>Sign in to track stocks</h4>
                        <p className="watchlist-state-subtitle">
                            Save your favorite stocks and monitor their live performance.
                        </p>
                        <Link to="/login" className="watchlist-signin-btn">
                            Sign In
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="watchlist-loading-state">
                        <p className="watchlist-loading-text">Loading your saved stocks...</p>
                    </div>
                ) : watchlist.length === 0 ? (
                    <div className="watchlist-empty-state">
                        <p className="watchlist-state-icon">📊</p>
                        <h4>Your watchlist is empty</h4>
                        <p className="watchlist-state-subtitle">
                            Search stocks in the search bar and click "+ Add to Watchlist".
                        </p>
                    </div>
                ) : (
                    <ul className="watchlist-list">
                        {watchlist.map((stock) => (
                            <li
                                key={stock._id}
                                onClick={() => navigate(`/stock/${stock.symbol}`)}
                                className="watchlist-item"
                            >
                                <div className="watchlist-item-info">
                                    <div className="watchlist-item-symbol">
                                        {stock.symbol?.split(".")[0]}
                                    </div>
                                    <div className="watchlist-item-name">
                                        {stock.name}
                                    </div>
                                </div>
                                <div className="watchlist-item-meta">
                                    {
                                        stock.price != null && (
                                            <div className="watchlist-item-price-block">
                                                <strong className="watchlist-item-price">
                                                    {stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </strong>
                                                <span className={`watchlist-item-change ${stock.change >= 0 ? "positive" : "negative"}`}>
                                                    {stock.change >= 0 ? "+" : "-"}
                                                    {stock.changePercent?.toFixed(2)}%
                                                </span>
                                            </div>

                                        )
                                    }
                                    <button
                                        onClick={(e) => handleDelete(e, stock._id)}
                                        title="Remove from watchlist"
                                        className="watchlist-delete-btn"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            }
        </article>
    )



}

export default WatchListPanel;