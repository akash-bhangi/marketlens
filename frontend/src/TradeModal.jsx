import { useState } from "react";
import "./TradeModal.css";

export default function TradeModal({
  isOpen,
  onClose,
  stock,

}) {
  const [tradeType, setTradeType] = useState("BUY"); // "BUY" or "SELL"

  if (!isOpen || !stock) return null;

  const symbolWithoutSuffix = (stock.symbol || "").split(".")[0];

  return (
    <div className="trade-modal-overlay" onClick={onClose}>
      {/* Stop click inside card from closing modal */}
      <div className="trade-modal-card" onClick={(e) => e.stopPropagation()}>

        {/* 1. Header */}
        < div className="trade-modal-header">
          <div className="trade-header-text">
            <h3 className="trade-company-title">{stock.name || stock.symbol}</h3>
            <span className="trade-ticker-pill">
              {symbolWithoutSuffix} • {stock.exchange || "NSE"}
            </span>
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
          <button
            type="button"
            className={`trade-type-btn buy ${tradeType === "BUY" ? "active" : ""}`}
            onClick={() => setTradeType("BUY")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            BUY
          </button>

          <button
            type="button"
            className={`trade-type-btn sell ${tradeType === "SELL" ? "active" : ""}`}
            onClick={() => setTradeType("SELL")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
              <polyline points="17 18 23 18 23 12"></polyline>
            </svg>
            SELL
          </button>
        </div>

      </div>
      <div className="trade-modal-card-body">
        <div className="trade-modal-content">
          <h3 className="trade-modal-price">Current Market Price</h3>
          <h4 className="trade-modal-price-value"></h4>


        </div>
      </div>
    </div >
  );
}