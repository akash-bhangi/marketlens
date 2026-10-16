import './Sidebar.css';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function IconDashboard() {
    return (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
    );
}

function IconWatchlist() {
    return (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function IconPortfolio() {
    return (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function IconTrendLogo() {
    return (
        <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    );
}

function IconSignOut() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

/**
 * Checks Indian Stock Market (NSE/BSE) hours in Indian Standard Time (IST, UTC+5:30).
 * Market is open Monday-Friday from 9:15 AM to 3:30 PM IST.
 */
function getIndianMarketStatus() {
    const now = new Date();
    // Convert current time to IST
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffsetMs);

    const day = istDate.getDay(); // 0 = Sun, 6 = Sat
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const isWeekday = day >= 1 && day <= 5;
    const marketOpenMinutes = 9 * 60 + 15;   // 09:15 AM (555 mins)
    const marketCloseMinutes = 15 * 60 + 30; // 03:30 PM (930 mins)

    const isOpen = isWeekday && currentMinutes >= marketOpenMinutes && currentMinutes <= marketCloseMinutes;

    return {
        isOpen,
        statusText: isOpen ? "LIVE" : "CLOSED",
        scheduleNote: isOpen ? "Market Open (09:15 - 15:30 IST)" : "Market Closed • Opens 09:15 AM IST"
    };
}

function Sidebar({ user, onLogout }) {
    const location = useLocation();
    const [marketStatus, setMarketStatus] = useState(getIndianMarketStatus);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMarketStatus(getIndianMarketStatus());
        }, 30000); // Check every 30s
        return () => clearInterval(intervalId);
    }, []);

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                {/* Brand Header */}
                <Link to="/" className="sidebar-brand-header">
                    <div className="sidebar-logo-icon">
                        <IconTrendLogo />
                    </div>
                    <div className="sidebar-brand-text">
                        <span className="sidebar-brand-title">MarketLens</span>
                        <span className="sidebar-brand-tagline">Paper Trading Terminal</span>
                    </div>
                </Link>

                {/* Section Header */}
                <div className="sidebar-section-header">
                    <span>MAIN MENU</span>
                </div>

                {/* Navigation Items */}
                <nav className="navigation">
                    <Link
                        to="/"
                        className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
                    >
                        <IconDashboard />
                        <span className="nav-label">Dashboard</span>
                        {location.pathname === "/" && <span className="nav-active-pill" />}
                    </Link>

                    <Link
                        to="/watchlist"
                        className={`nav-item ${location.pathname === "/watchlist" ? "active" : ""}`}
                    >
                        <IconWatchlist />
                        <span className="nav-label">Watchlist</span>
                        {location.pathname === "/watchlist" && <span className="nav-active-pill" />}
                    </Link>

                    <button
                        type="button"
                        className="nav-item nav-item-btn"
                        title="Portfolio tracking feature coming soon"
                    >
                        <IconPortfolio />
                        <span className="nav-label">Portfolio</span>
                        <span className="nav-badge-soon">SOON</span>
                    </button>
                </nav>
            </div>

            {/* Sidebar Bottom / Footer */}
            <div className="sidebar-footer">
                {/* Market Status Widget */}
                <div className="sidebar-market-card">
                    <div className="market-card-header">
                        <div className="market-card-status-left">
                            <span className={`market-pulse-dot ${marketStatus.isOpen ? "popping" : "static-closed"}`}></span>
                            <span className="market-card-title">Indian Markets</span>
                        </div>
                        <span className={`live-status-pill ${marketStatus.isOpen ? "open" : "closed"}`}>
                            {marketStatus.statusText}
                        </span>
                    </div>
                    <div className="market-card-hours">{marketStatus.scheduleNote}</div>
                </div>

                {/* User Profile or Guest Quick Card */}
                {user ? (
                    <div className="sidebar-user-card">
                        <div className="user-avatar-initial">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="user-card-info">
                            <div className="user-card-name">{user.name}</div>
                            <div className="user-card-balance">
                                ₹{user.virtualBalance ? user.virtualBalance.toLocaleString("en-IN") : "0"}
                            </div>
                        </div>
                        {onLogout && (
                            <button
                                className="sidebar-logout-btn"
                                onClick={onLogout}
                                title="Sign Out"
                                aria-label="Sign Out"
                            >
                                <IconSignOut />
                            </button>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="sidebar-login-prompt">
                        <span>Sign In to Trade</span>
                        <span className="sidebar-login-arrow">→</span>
                    </Link>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;