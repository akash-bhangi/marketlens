import "./Header.css";
import SearchBox from "./SearchBox";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Header({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState(null);
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isStockPage = location.pathname.startsWith("/stock/");
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
      {isStockPage ? (
        <div className="breadcrumb">
          <span
            style={{
              cursor: "pointer",
              color: "#9ca3af",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Dashboard
          </span>
          <span style={{ margin: "0 0.5rem", color: "#9ca3af" }}>›</span>
          <span style={{ color: "#6b7280" }}>Stocks</span>
          <span style={{ margin: "0 0.5rem", color: "#9ca3af" }}>›</span>
          <strong>{displayName.toUpperCase()}</strong>
        </div>
      ) : (
        <div>
          <h1>Market Dashboard</h1>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <SearchBox stock={stock} setSearchQuery={setSearchQuery} />

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#059669",
                background: "#ecfdf5",
                padding: "0.4rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1fae5",
              }}
            >
              ₹{user.virtualBalance?.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#111827" }}>
              {user.name}
            </span>
            <button
              onClick={onLogout}
              style={{
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                color: "#ef4444",
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600",
                transition: "all 0.15s ease",
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              backgroundColor: "#141c2d",
              color: "#ffffff",
              textDecoration: "none",
              padding: "0.55rem 1.15rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;