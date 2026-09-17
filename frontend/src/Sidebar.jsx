import './Sidebar.css'
function Sidebar() {
    return (
        <>
            <aside className="sidebar">
                <div className="brand">MarketLens</div>
                <p className="subtitle">Indian market intelligence</p>

                <nav className="navigation">
                    <button className="nav-item active">Dashboard</button>
                    <button className="nav-item">Markets</button>
                    <button className="nav-item">Watchlist</button>
                    <button className="nav-item">Portfolio</button>
                </nav>
            </aside></>
    )
}
export default Sidebar