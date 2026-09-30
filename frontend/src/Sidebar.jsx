import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-brand-header">
                    <div className="sidebar-logo-icon">📈</div>
                    <div>
                        <div className="sidebar-brand-title">MarketLens</div>
                        <div className="sidebar-brand-tagline">Indian market intelligence</div>
                    </div>
                </div>

                <nav className="navigation">
                    <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`} >
                        Dashboard
                    </Link>

                    <button className="nav-item">Markets</button>
                    <button className="nav-item">Watchlist</button>
                    <button className="nav-item">Portfolio</button>
                </nav>
            </aside ></>
    )
}
export default Sidebar