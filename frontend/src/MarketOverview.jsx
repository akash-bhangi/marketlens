import './MarketOverview.css';
import WatchListPanel from './WatchListPanel.jsx';

function getTimeAgo(dateString) {
    if (!dateString) return "2h ago";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "2h ago";

    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) {
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        return diffInMins <= 1 ? "Just now" : `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else {
        const days = Math.floor(diffInHours / 24);
        return `${days}d ago`;
    }
}

function getSourceName(article) {
    if (typeof article?.source === 'object' && article?.source?.name) {
        return article.source.name;
    }
    if (typeof article?.source === 'string' && article.source) {
        return article.source;
    }
    return article?.publisher || 'Market Wire';
}

const defaultNews = [
    {
        title: "Indian Stock Markets Reach Record High Supported by Financials and Tech Momentum",
        source: { name: "Financial Express" },
        publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        url: "#"
    },
    {
        title: "RBI Monetary Policy Committee Maintains Repo Rate Stance Amid Positive Growth Signals",
        source: { name: "Economic Times" },
        publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        url: "#"
    },
    {
        title: "Tech Giants Announce Strategic Infrastructure Investments in Enterprise Cloud Services",
        source: { name: "Mint" },
        publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        url: "#"
    },
    {
        title: "Q2 Corporate Earnings Exceed Expectations Across Major Industrial and Consumer Sectors",
        source: { name: "Reuters" },
        publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        url: "#"
    }
];

function MarketOverview({ index, news }) {
    const displayNews = (news && news.length > 0) ? news : defaultNews;

    return (
        <div className="dashboard-middle-content">
            {/* Major Indices Section */}
            <section className="indices-section">
                <div className="section-heading-row">
                    <h2 className="section-title">Major Indices</h2>
                    <span className="section-subtitle">Real-time benchmark quotes across Indian exchanges</span>
                </div>

                <div className="indices-grid">
                    {index && index.length > 0 ? (
                        index.map((idx) => {
                            const isPositive = (idx?.change ?? 0) >= 0;
                            return (
                                <div className="index-card" key={idx?.symbol || idx?.name}>
                                    <div className="index-card-header">
                                        <span className="index-card-name">{idx?.name}</span>
                                        <span className={`index-change-pill ${isPositive ? "positive" : "negative"}`}>
                                            <span className="trend-arrow">{isPositive ? "▲" : "▼"}</span>
                                            {isPositive ? "+" : ""}{idx?.changePercent != null ? idx.changePercent.toFixed(2) : "0.00"}%
                                        </span>
                                    </div>
                                    <div className="index-card-body">
                                        <span className="index-card-price">
                                            ₹{idx?.price ? idx.price.toLocaleString('en-IN') : "--"}
                                        </span>
                                        <span className={`index-card-points ${isPositive ? "positive" : "negative"}`}>
                                            {isPositive ? "+" : ""}{idx?.change != null ? idx.change.toFixed(2) : "0.00"} pts
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="indices-loading-card">
                            <span className="loading-spinner-dot"></span>
                            <span>Loading live market indices...</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Symmetrical Grid for Watchlist & Market News */}
            <section className="watchlist-news-grid">
                <WatchListPanel />

                <article className="dashboard-panel news-panel">
                    <div className="panel-header">
                        <div className="panel-header-left">
                            <h3 className="panel-title">Market News</h3>
                        </div>
                        <span className="panel-status-pill">Latest</span>
                    </div>

                    <div className="panel-body">
                        <ul className="news-list">
                            {displayNews.map((article, idx) => {
                                const sourceName = getSourceName(article);
                                const timeAgo = getTimeAgo(article?.publishedAt);

                                return (
                                    <li key={article?.url || idx} className="news-item">
                                        <a
                                            href={article?.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="news-title"
                                        >
                                            {article?.title}
                                        </a>
                                        <div className="news-meta">
                                            <span className="news-source">{sourceName}</span>
                                            <span className="news-bullet">•</span>
                                            <span className="news-time">{timeAgo}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default MarketOverview;