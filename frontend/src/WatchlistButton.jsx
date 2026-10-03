import { useEffect, useState } from "react";

export default function WatchlistButton({ stockData }) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const symbol = stockData?.symbol;

    // Check if this stock is already in the user's watchlist
    useEffect(() => {
        async function checkWatchlist() {
            const token = localStorage.getItem("token");
            if (!token || !symbol) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/watchlist`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    const list = data.watchlist || data || [];
                    const cleanSymbol = symbol.toUpperCase().replace(".NS", "");
                    const found = list.some((item) => {
                        const itemClean = item.symbol?.toUpperCase().replace(".NS", "");
                        return itemClean === cleanSymbol;
                    });
                    setIsInWatchlist(found);
                }
            } catch (err) {
                console.error("Error checking watchlist:", err);
            }
        }

        checkWatchlist();
    }, [symbol]);

    // Handle Add / Remove on click
    const handleToggle = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first to save stocks to your watchlist!");
            return;
        }

        if (!symbol) return;

        setIsLoading(true);
        try {
            if (isInWatchlist) {
                // DELETE from watchlist
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/watchlist/${encodeURIComponent(symbol)}`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (res.ok) {
                    setIsInWatchlist(false);
                } else {
                    console.error("Failed to remove from watchlist:", res.status);
                }
            } else {
                // POST add to watchlist
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
                    setIsInWatchlist(true);
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
            className={`btn ${isInWatchlist ? "btn-secondary" : "btn-primary"}`}
            onClick={handleToggle}
            disabled={isLoading}
        >
            {isLoading
                ? "Updating..."
                : isInWatchlist
                    ? "In Watchlist ✓"
                    : "+ Add to Watchlist"}
        </button>
    );
}