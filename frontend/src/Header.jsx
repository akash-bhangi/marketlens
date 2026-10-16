import "./Header.css";
import SearchBox from "./SearchBox";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Header({ user }) {
  const [searchQuery, setSearchQuery] = useState(null);
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isStockPage = location.pathname.startsWith("/stock/");
  const isWatchlistPage = location.pathname === "/watchlist";
  const stockSymbolFromUrl = isStockPage ? location.pathname.split("/")[2] : null;
  const displayName = stockSymbolFromUrl ? stockSymbolFromUrl.split(".")[0] : "";

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length <= 1) {
      setStock([]);
      return;
    }
    const timer = setTimeout(() => {
      async function searchStock() {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/search?query=${searchQuery}`
          );
          const data = await res.json();
          setStock(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Error while searching Stock:", err);
        }
      }
      searchStock();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="topbar">
      {/* Left side title / breadcrumb */}
      <div className="topbar-left">
        {isStockPage ? (
          <div className="breadcrumb">
            <button
              className="breadcrumb-btn"
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>
            <span className="breadcrumb-slash">›</span>
            <span className="breadcrumb-item">Stocks</span>
            <span className="breadcrumb-slash">›</span>
            <span className="breadcrumb-current">{displayName.toUpperCase()}</span>
          </div>
        ) : isWatchlistPage ? (
          <div className="header-title-block">
            <h1 className="header-title">Watchlist</h1>
            <p className="header-subtitle">Monitored assets & real-time movements</p>
          </div>
        ) : (
          <div className="header-title-block">
            <h1 className="header-title">Market Dashboard</h1>
            <p className="header-subtitle">Real-time Indian indices & simulated paper trading</p>
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div className="topbar-right">
        <SearchBox stock={stock} setSearchQuery={setSearchQuery} />

        {!user && (
          <Link to="/login" className="header-signin-btn">
            <span>Sign in</span>
            <span className="signin-arrow">→</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;