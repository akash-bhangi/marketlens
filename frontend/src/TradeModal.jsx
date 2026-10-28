import { useState } from "react";
import "./TradeModal.css";

export default function TradeModal({ isOpen, onClose, stock, user }) {
  const [tradeType, setTradeType] = useState("BUY");
  const [quantity, setQuantity] = useState(1);

  const currentPrice = stock?.price || 0;
  const change = stock?.change || 0;
  const changePercent = stock?.changePercent || 0;
  const isPositive = change >= 0;
  const virtualBalance = user?.virtualBalance || 0;
  const orderValue = currentPrice * quantity;
  const remainingBalance = tradeType === "BUY"
    ? virtualBalance - orderValue
    : virtualBalance + orderValue;

  const insufficientFunds = tradeType === "BUY" && orderValue > virtualBalance;


  if (!isOpen) return null;

  const symbolWithoutSuffix = (stock?.symbol || "TCS.NS").split(".")[0];

  return (
    <div className="trade-modal-overlay" onClick={onClose}>
      {/* Modal Card */}
      <div className="trade-modal-card" onClick={(e) => e.stopPropagation()}>

        {/* 1. Header */}
        <div className="trade-modal-header">
          <div className="trade-header-text">
            <div className="trade-title-row">
              <h3 className="trade-company-title">
                {stock?.name || "Tata Consultancy Services"}
              </h3>
              <span className="trade-ticker-pill">
                {symbolWithoutSuffix} • {stock?.exchange || "NSE"}
              </span>
            </div>
            <p className="trade-subtitle">
              Live Market Execution • Real-time paper order
            </p>
          </div>

          <button className="trade-close-btn" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 2. BUY / SELL Segmented Switcher */}
        <div className="trade-type-switcher">
          <button type="button" className={`trade-type-btn buy  ${tradeType === "BUY" ? "active" : ""}`} onClick={() => setTradeType("BUY")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            BUY
          </button>

          <button type="button" className={`trade-type-btn sell ${tradeType === "SELL" ? "active" : ""}`} onClick={() => setTradeType("SELL")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
              <polyline points="17 18 23 18 23 12"></polyline>
            </svg>
            SELL
          </button>
        </div>

        {/* 3. Live Market Price Box */}
        <div className="trade-price-card">
          <div className="trade-price-top">
            <span className="trade-price-title">Current Market Price (NSE)</span>
          </div>
          <div className="trade-price-row">
            <span className="trade-price-val">₹{currentPrice.toLocaleString("en-IN")}</span>
            <span className={`trade-price-badge ${isPositive ? "pos" : "neg"}`}>
              {isPositive ? "▲+" : "▼"}{change.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? "+" : ""}{changePercent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)
            </span>
          </div>
        </div>

        {/* 4. Portfolio Holdings Line */}
        <div className="trade-holdings-line">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span>
            Holdings in Portfolio: <strong>10 shares</strong> (₹35,862.00)
          </span>
        </div>

        {/* 5. Order Quantity Section */}
        <div className="trade-quantity-section">
          <div className="trade-quantity-top">
            <label>Order Quantity</label>
            <span className="trade-order-badge">Market Order</span>
          </div>
          <div className="trade-stepper-control">
            <button type="button" className="trade-stepper-btn" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>−</button>
            <input type="number" className="trade-stepper-input" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
            <button type="button" className="trade-stepper-btn" onClick={() => setQuantity((prev) => Math.max(1, prev + 1))}>+</button>
          </div>
          <div className="trade-quick-chips">
            <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev + 1))}>+1</button>
            <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev + 5))}>+5</button>
            <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev + 10))}>+10</button>
            <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev + 25))}>+25</button>
            <button type="button" className="max" onClick={() => {
              if (currentPrice && currentPrice > 0) {
                const maxShares = Math.floor((virtualBalance || 0) / currentPrice);
                setQuantity(Math.max(1, maxShares))
              }
            }}>Max</button>
          </div>
        </div>

        {/* 6. Financial Breakdown Box */}
        <div className="trade-breakdown-box">
          <div className="trade-breakdown-row">
            <span className="breakdown-label">Estimated Order Value</span>
            <span className="breakdown-val highlight">₹{orderValue.toLocaleString("en-IN")}</span>
          </div>
          <div className="trade-breakdown-row">
            <span className="breakdown-label">Available Virtual Funds</span>
            <span className="breakdown-val">₹{virtualBalance.toLocaleString("en-IN")}</span>
          </div>
          <div className="trade-breakdown-row">
            <span className="breakdown-label remaining">
              <span className="status-dot"></span>
              Remaining Balance
            </span>
            <span className={`breakdown-val ${remainingBalance < 0 ? "negative" : ""}`}>₹{remainingBalance.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* 7. Action Button */}
        <button type="button" className={`trade-execute-btn ${tradeType === "BUY" ? "buy" : "sell"}`} disabled={insufficientFunds}>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {tradeType === "BUY" ? (
              <>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </>
            ) : (
              <>
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
              </>
            )}
          </svg>
          <span>{insufficientFunds
            ? "Insufficient Funds"
            : `Execute ${tradeType === "BUY" ? "Buy" : "Sell"} Order • ₹${orderValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          }</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* 8. Educational / Security Disclaimer */}
        <p className="trade-disclaimer">
          🔒 Virtual Paper Trading: Simulates real order execution without risking real capital.
        </p>

      </div>
    </div>
  );
}
