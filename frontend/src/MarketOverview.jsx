import './MarketOverview.css';

function MarketOverview({ index }) {
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
                        <h4>Latest business headlines</h4>
                        <p>News will appear here after the dashboard data step.</p>
                    </div>
                </article>
            </section>
        </>

    )
}
export default MarketOverview;  