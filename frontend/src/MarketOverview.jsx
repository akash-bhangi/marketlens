import './MarketOverview.css';

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
    return article?.publisher || 'Express';
}

const defaultNews = [
    {
        title: "Express: Indian Stock Markets Reach Record High Supported by Financials and Tech",
        source: { name: "Express" },
        publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        url: "#"
    },
    {
        title: "RBI Monetary Policy Committee Maintains Repo Rate Stance amidst Growth Signals",
        source: { name: "Financial Express" },
        publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        url: "#"
    },
    {
        title: "Tech Giants Announce Strategic Infrastructure Investments in Enterprise Cloud Services",
        source: { name: "Express" },
        publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        url: "#"
    },
    {
        title: "Q2 Corporate Earnings Exceed Expectations Across Major Industrial and Retail Sectors",
        source: { name: "Reuters" },
        publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        url: "#"
    }
];

function MarketOverview({ index, news }) {
    const displayNews = (news && news.length > 0) ? news : defaultNews;

    return (
        <>
            <h2 className="market-overview-title">Market Overview</h2>
            <section className="market-overview">
                {index && index.length > 0 ? (
                    index?.map((idx) => {
                        return (
                            <div className="card" key={idx?.symbol}>
                                <h4>{idx?.name}</h4>
                                <p>₹{idx?.price?.toLocaleString('en-IN')}<span style={{ color: idx?.change >= 0 ? "green" : "red", marginLeft: "0.5rem", fontSize: "1rem" }}>({idx?.change >= 0 ? "+" : ""}{idx?.changePercent?.toFixed(2)}%)</span></p>
                            </div>
                        )
                    })
                ) : (<p>Loading Market Data...</p>)}
            </section>
            <section className="watchlist-news-grid">
                <article className="watchlist">
                    <h3 className="eyebrow">Your watchlist</h3>
                    <div className="watchlist-content">
                        <h4>Start tracking stocks</h4>
                        <p>Saved stocks will appear here after authentication is built.</p>
                    </div>
                </article>

                <article className="news">
                    <h3 className="eyebrow">Market news</h3>
                    <div className="news-content">
                        <ul className='news-list'>
                            {
                                displayNews.map((article, idx) => {
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
                                            <hr className="news-divider" />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </article>
            </section>
        </>
    )
}

export default MarketOverview;  