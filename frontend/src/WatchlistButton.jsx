import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function WatchlistButton({ stockData }) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistItemId, setWatchlistItemId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const navigate = useNavigate();

    const symbol = stockData?.symbol;

    const checkWatchlist = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token || !symbol) {
            setIsInWatchlist(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/watchlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                const list = data.watchlist || data || [];
                const cleanSymbol = symbol.toUpperCase().replace(".NS", "").replace(".BO", "");
                const matchedItem = list.find((item) => {
                    const itemClean = item.symbol?.toUpperCase().replace(".NS", "").replace(".BO", "");
                    return itemClean === cleanSymbol;
                });

                if (matchedItem) {
                    setIsInWatchlist(true);
                    setWatchlistItemId(matchedItem._id);
                } else {
                    setIsInWatchlist(false);
                    setWatchlistItemId(null);
                }
            }
        } catch (err) {
            console.error("Error checking watchlist:", err);
        }
    }, [symbol]);

    useEffect(() => {
        checkWatchlist();

        // Listen for external watchlist sync events
        const handleSync = () => checkWatchlist();
        window.addEventListener("watchlistUpdated", handleSync);
        return () => window.removeEventListener("watchlistUpdated", handleSync);
    }, [checkWatchlist]);

    const handleToggle = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Prompt sign in cleanly
            setFeedbackMsg("Sign in required");
            setTimeout(() => {
                navigate("/login");
            }, 700);
            return;
        }

        if (!symbol) return;

        setIsLoading(true);
        setFeedbackMsg("");

        try {
            if (isInWatchlist) {
                // DELETE from watchlist
                const deleteTarget = watchlistItemId || encodeURIComponent(symbol);
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/watchlist/${deleteTarget}`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (res.ok) {
                    setIsInWatchlist(false);
                    setWatchlistItemId(null);
                    window.dispatchEvent(new Event("watchlistUpdated"));
                } else {
                    console.error("Watchlist removal failed with status:", res.status);
                }
            } else {
                // POST to watchlist
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/watchlist/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        symbol: stockData.symbol,
                        name: stockData.name || stockData.symbol,
                        exchange: stockData.exchange || "NSE",
                    }),
                });

                if (res.ok) {
                    const resData = await res.json().catch(() => ({}));
                    setIsInWatchlist(true);
                    if (resData.stock?._id) {
                        setWatchlistItemId(resData.stock._id);
                    }
                    window.dispatchEvent(new Event("watchlistUpdated"));
                } else {
                    const data = await res.json().catch(() => ({}));
                    if (res.status === 400 && data.message?.includes("already")) {
                        setIsInWatchlist(true);
                    }
                }
            }
        } catch (err) {
            console.error("Watchlist toggle failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            className={`btn-watchlist ${isInWatchlist ? "saved" : "unsaved"}`}
            onClick={handleToggle}
            disabled={isLoading}
            title={
                feedbackMsg
                    ? feedbackMsg
                    : isInWatchlist
                    ? "Click to remove from watchlist"
                    : "Add to personal watchlist"
            }
        >
            {feedbackMsg ? (
                <span>{feedbackMsg}</span>
            ) : isInWatchlist ? (
                <>
                    <svg className="btn-icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 12 2" />
                    </svg>
                    <span>{isLoading ? "Updating..." : "Saved in Watchlist"}</span>
                </>
            ) : (
                <>
                    <svg className="btn-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 12 2" />
                    </svg>
                    <span>{isLoading ? "Updating..." : "+ Watchlist"}</span>
                </>
            )}
        </button>
    );
}