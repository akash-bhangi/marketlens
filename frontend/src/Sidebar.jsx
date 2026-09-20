import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    return (
        <>
            <aside className="sidebar">
                <div className="brand">MarketLens</div>
                <p className="subtitle">Indian market intelligence</p>

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