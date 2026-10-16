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
                        };
                    } catch (error) {
                        console.log(`Error fetching quote for ${item.symbol}:`, error);
                    }
                    return item;
                }));
                setwatchlist(enrichedItems);
            } catch (error) {
                console.log("Error Fetching Watchlist:", error);
            } finally {
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
            });

            if (!response.ok) {
                throw new Error("Failed to delete from watchlist");
            }
            setwatchlist(watchlist.filter(item => item._id !== stockId));
        } catch (error) {
            console.log("Error deleting from watchlist:", error);
        }
    }

    return (
        <article className="dashboard-panel watchlist-panel">
            <div className="panel-header">
                <div className="panel-header-left">
                    <h3 className="panel-title">Watchlist</h3>
                    {watchlist && watchlist.length > 0 && (
                        <span className="panel-count-badge">{watchlist.length}</span>
                    )}
                </div>
                <Link to="/watchlist" className="panel-header-link">View all ›</Link>
            </div>

            <div className="panel-body">
                {!token ? (
                    <div className="watchlist-empty-state">
                        <div className="empty-state-icon-wrap">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h4 className="empty-state-title">Sign in to track stocks</h4>
                        <p className="empty-state-subtitle">
                            Monitor price movements and save stocks to your personal watchlist.
                        </p>
                        <Link to="/login" className="watchlist-signin-btn">
                            Sign In
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="watchlist-loading-state">
                        <span className="loading-spinner-dot"></span>
                        <p className="watchlist-loading-text">Loading saved stocks...</p>
                    </div>
                ) : watchlist.length === 0 ? (
                    <div className="watchlist-empty-state">
                        <div className="empty-state-icon-wrap">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <h4 className="empty-state-title">Your watchlist is empty</h4>
                        <p className="empty-state-subtitle">
                            Use the search bar above to look up stocks and click "+ Watchlist".
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
                                    {stock.price != null && (
                                        <div className="watchlist-item-price-block">
                                            <strong className="watchlist-item-price">
                                                ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                            </strong>
                                            <span className={`watchlist-item-change ${stock.change >= 0 ? "positive" : "negative"}`}>
                                                {stock.change >= 0 ? "+" : ""}
                                                {stock.changePercent?.toFixed(2)}%
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => handleDelete(e, stock._id)}
                                        title="Remove from watchlist"
                                        className="watchlist-delete-btn"
                                        aria-label="Remove stock"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </article>
    );
}

export default WatchListPanel;