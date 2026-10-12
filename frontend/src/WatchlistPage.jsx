import React from "react";
import "./WatchlistPage.css";

function WatchlistPage() {
    return (
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
        </div>
    );
}

export default WatchlistPage;