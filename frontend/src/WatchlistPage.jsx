import { useState, useEffect } from "react";
import "./WatchlistPage.css";

const BADGE_COLORS = [
    { bg: "#EEF2FF", text: "#4F46E5" }, // Indigo
    { bg: "#EFF6FF", text: "#2563EB" }, // Blue
    { bg: "#F5F3FF", text: "#7C3AED" }, // Purple
    { bg: "#FFF7ED", text: "#EA580C" }, // Orange
    { bg: "#ECFEFF", text: "#0891B2" }, // Cyan
    { bg: "#FFFBEB", text: "#D97706" }, // Amber
    { bg: "#F1F5F9", text: "#475569" }, // Slate
    { bg: "#F0FDF4", text: "#16A34A" }, // Emerald
];

const getBadgeStyle = (str = "") => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % BADGE_COLORS.length;
    return BADGE_COLORS[index];
};

function WatchlistPage() {
    const [active, setActive] = useState("all stocks");
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        async function fetchWatchList() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/watchlist`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch watchlist");
                }
                const data = await response.json();
                const items = Array.isArray(data) ? data : data.watchlist || [];
                const enrichedData = await Promise.all(
                    items.map(async (item) => {
                        try {
                            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stock/${item.symbol}`);
                            const priceData = await res.json();
                            return {
                                ...item,
                                priceData,
                                price: priceData?.price,
                                change: priceData?.change,
                                changePercent: priceData?.changePercent,
                                high: priceData?.high,
                                low: priceData?.low,
                                volume: priceData?.volume
                            };
                        } catch (err) {
                            console.log(`Failed to fetch stock quote for ${item.symbol}:`, err);
                            return item;
                        }
                    })
                );
                setWatchlist(enrichedData);
            } catch (error) {
                console.log(error);
            }
        }
        fetchWatchList();
    }, []);

    // Filter stocks based on active tab: "all stocks" | "gainers" | "decliners"
    const filteredWatchlist = watchlist.filter((stock) => {
        const rawChange = stock.dayChange ?? stock.change ?? 0;
        const isPositive = typeof rawChange === "number" ? rawChange >= 0 : !String(rawChange).trim().startsWith("-");

        if (active === "gainers") {
            return isPositive;
        }
        if (active === "decliners") {
            return !isPositive;
        }
        return true;
    });

    return (
        <>
            <div className="watchlist-page">
                {/* Top Heading Bar */}
                <div className="wl-heading-bar">
                    <div className="wl-heading-text">
                        <h2 className="wl-main-title">My Watchlist</h2>
                        <p className="wl-main-subtitle">
                            Follow price movement, trading activity, and daily ranges across your selected NSE stocks.
                        </p>
                    </div>

                    <button className="wl-add-stock-btn">
                        <span className="wl-btn-plus">+</span> Add stock
                    </button>
                </div>

                {/* 4 Summary Cards */}
                <section className="wl-summary-cards">
                    {/* Card 1: Tracked stocks */}
                    <div className="wl-card">
                        <div className="wl-card-content">
                            <span className="wl-card-label">Tracked stocks</span>
                            <div className="wl-card-val-row">
                                <span className="wl-card-value">8</span>
                                <span className="wl-card-subtext">Across 6 sectors</span>
                            </div>
                        </div>
                        <div className="wl-card-icon-badge wl-badge-blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                        </div>
                    </div>

                    {/* Card 2: Advancing */}
                    <div className="wl-card">
                        <div className="wl-card-content">
                            <span className="wl-card-label">Advancing</span>
                            <div className="wl-card-val-row">
                                <span className="wl-card-value">5</span>
                                <span className="wl-card-subtext wl-subtext-green">62.5% of list</span>
                            </div>
                        </div>
                        <div className="wl-card-icon-badge wl-badge-green">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                    </div>

                    {/* Card 3: Declining */}
                    <div className="wl-card">
                        <div className="wl-card-content">
                            <span className="wl-card-label">Declining</span>
                            <div className="wl-card-val-row">
                                <span className="wl-card-value">3</span>
                                <span className="wl-card-subtext wl-subtext-red">37.5% of list</span>
                            </div>
                        </div>
                        <div className="wl-card-icon-badge wl-badge-red">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                                <polyline points="17 18 23 18 23 12"></polyline>
                            </svg>
                        </div>
                    </div>

                    {/* Card 4: Average move */}
                    <div className="wl-card">
                        <div className="wl-card-content">
                            <span className="wl-card-label">Average move</span>
                            <div className="wl-card-val-row">
                                <span className="wl-card-value">+0.32%</span>
                                <span className="wl-card-subtext wl-subtext-green">Today</span>
                            </div>
                        </div>
                        <div className="wl-card-icon-badge wl-badge-green">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                    </div>
                </section>
                <section className="watchlist-filters">
                    <div className="wl-filter-slider">
                        <button className={`wl-filter-btn ${active === "all stocks" ? "active" : ""} `} onClick={() => setActive("all stocks")} >All Stocks</button>
                        <button className={`wl-filter-btn ${active === "gainers" ? "active" : ""} `} onClick={() => setActive("gainers")} >Gainers</button>
                        <button className={`wl-filter-btn ${active === "decliners" ? "active" : ""} `} onClick={() => setActive("decliners")} >Decliner</button>
                    </div>
                </section>
                <section className="watchlist-table-card">
                    <div className="wl-table-header">
                        <div className="wl-table-title-group">
                            <h4 className="wl-table-title">{active === "all stocks" ? "All stocks" : active === "gainers" ? "Gainers" : "Decliners"}</h4>
                            <p className="wl-table-subtitle">Live prices • Last updated 3:28 PM IST</p>
                        </div>
                        <div className="wl-table-actions">
                            <button className="wl-action-outline-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                Create alert
                            </button>
                            <button className="wl-action-outline-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="wl-grid-table">
                        <div className="wl-grid-header" style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.5fr 0.8fr 0.9fr 40px", padding: "0.5rem 1rem", backgroundColor: "#eef2f3ff" }}>
                            <div className="wl-col-company">COMPANY</div>
                            <div className="wl-col-symbol">SYMBOL</div>
                            <div className="wl-col-price">
                                PRICE
                                <svg className="wl-sort-indicator" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="12 19 5 12 19 12"></polygon>
                                </svg>
                            </div>
                            <div className="wl-col-change">DAY CHANGE</div>
                            <div className="wl-col-range">DAY RANGE</div>
                            <div className="wl-col-volume">VOLUME</div>
                            <div className="wl-col-status">STATUS</div>
                            <div className="wl-col-action"></div>
                        </div>
                        {/* Map */}
                        {filteredWatchlist.map((stock, index) => {
                            const displayName = stock.name || stock.symbol || "";
                            const firstLetter = displayName.charAt(0).toUpperCase() || "S";
                            const badgeStyle = getBadgeStyle(displayName);

                            const rawChange = stock.dayChange ?? stock.change ?? 0;
                            const isPositive = typeof rawChange === "number" ? rawChange >= 0 : !String(rawChange).trim().startsWith("-");
                            const formattedChange = typeof rawChange === "number"
                                ? `${isPositive ? "+" : ""}${rawChange.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : rawChange;

                            const currentPrice = Number(stock?.lastTradedPrice || stock?.price || 0);
                            const lowPrice = Number(stock?.low || (currentPrice ? currentPrice * 0.985 : 0));
                            const highPrice = Number(stock?.high || (currentPrice ? currentPrice * 1.015 : 0));
                            const rangeSpan = highPrice - lowPrice;
                            const rangePercent = rangeSpan > 0 
                                ? Math.min(95, Math.max(5, ((currentPrice - lowPrice) / rangeSpan) * 100))
                                : 50;

                            return (
                                <div key={stock.symbol || stock._id || index} className="wl-grid-row">
                                    <div className="wl-col-company">
                                        <div className="wl-company-cell">
                                            <span
                                                className="wl-initial-badge"
                                                style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                                            >
                                                {firstLetter}
                                            </span>
                                            <span className="wl-company-name">{stock.name}</span>
                                        </div>
                                    </div>
                                    <div className="wl-col-symbol">{stock.symbol.split(".")[0].toUpperCase()}</div>
                                    <div className="wl-col-price">
                                        ₹{stock?.lastTradedPrice?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || stock?.price?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "—"}
                                    </div>
                                    <div className={`wl-col-change ${isPositive ? "is-pos" : "is-neg"}`}>
                                        {formattedChange}
                                    </div>
                                    <div className="wl-col-range">
                                        <div className="wl-range-cell">
                                            <div className="wl-range-bar-track">
                                                <div
                                                    className="wl-range-bar-fill"
                                                    style={{
                                                        left: `${Math.max(0, rangePercent - 15)}%`,
                                                        width: "30%"
                                                    }}
                                                ></div>
                                                <div
                                                    className="wl-range-marker"
                                                    style={{ left: `${rangePercent}%` }}
                                                ></div>
                                            </div>
                                            <div className="wl-range-labels">
                                                <span>L {lowPrice ? lowPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "—"}</span>
                                                <span>H {highPrice ? highPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "—"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="wl-col-volume">
                                        {stock?.volume ? (stock.volume > 1000000 ? `${(stock.volume / 1000000).toFixed(1)}M` : `${(stock.volume / 1000).toFixed(1)}K`) : "—"}
                                    </div>
                                    <div className="wl-col-status">
                                        {stock?.status || "Active"}
                                    </div>
                                    <div className="wl-col-action">
                                        <button className="wl-delete-btn">•••</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Table Footer */}
                    <div className="wl-table-footer">
                        <span className="wl-footer-count">Showing {filteredWatchlist.length} of {watchlist.length} tracked stocks</span>
                        <div className="wl-footer-refresh">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            <span>Auto-refreshes every 30 seconds</span>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
export default WatchlistPage;