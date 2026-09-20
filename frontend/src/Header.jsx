import "./Header.css"
import SearchBox from './SearchBox'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

function Header({ backendStatus }) {
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
                {
                    try {
                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/search?query=${searchQuery}`);
                        const data = await res.json();
                        setStock(Array.isArray(data) ? data : []);
                    }
                    catch (err) {
                        console.error("Error while searching Stock:", err);
                    }
                }
            }
            searchStock();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery])
    return (
        <>
            <header className="topbar">
                {
                    (isStockPage) ?
                        (
                            <div className="breadcrumb">
                                <span
                                    style={{
                                        cursor: "pointer",
                                        color: "#9ca3af"
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
                        ) :
                        (
                            <div>
                                <h1>Market Dashboard</h1>
                                <span className="api-status">{backendStatus}</span>
                            </div>
                        )}
                <SearchBox
                    stock={stock}
                    setSearchQuery={setSearchQuery}
                />
            </header>
        </>
    )
}
export default Header