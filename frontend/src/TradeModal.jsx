import React from "react";
import "./TradeModal.css";

export default function TradeModal({ isOpen, onClose, stock }) {
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
          <button type="button" className="trade-type-btn buy active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            BUY
          </button>

          <button type="button" className="trade-type-btn sell">
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
            <span className="trade-price-val">₹3,586.20</span>
            <span className="trade-price-badge pos">
              +22.65 (+0.64%)
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
            <button type="button" className="trade-stepper-btn">−</button>
            <input type="number" className="trade-stepper-input" defaultValue="1" />
            <button type="button" className="trade-stepper-btn">+</button>
          </div>
          <div className="trade-quick-chips">
            <button type="button">+1</button>
            <button type="button">+5</button>
            <button type="button">+10</button>
            <button type="button">+25</button>
            <button type="button" className="max">Max</button>
          </div>
        </div>

        {/* 6. Financial Breakdown Box */}
        <div className="trade-breakdown-box">
          <div className="trade-breakdown-row">
            <span className="breakdown-label">Estimated Order Value</span>
            <span className="breakdown-val highlight">₹3,586.20</span>
          </div>
          <div className="trade-breakdown-row">
            <span className="breakdown-label">Available Virtual Funds</span>
            <span className="breakdown-val">₹10,00,000.00</span>
          </div>
          <div className="trade-breakdown-row">
            <span className="breakdown-label remaining">
              <span className="status-dot"></span>
              Remaining Balance
            </span>
            <span className="breakdown-val">₹9,96,413.80</span>
          </div>
        </div>

        {/* 7. Action Button */}
        <button type="button" className="trade-execute-btn buy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>Execute Buy Order • ₹3,586.20</span>
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
