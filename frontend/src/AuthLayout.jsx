import "./Auth.css";

export default function AuthLayout({ children, headline, subheadline }) {
  return (
    <div className="auth-page">
      {/* Left Dark Showcase Panel */}
      <div className="auth-left-panel">
        <div className="auth-brand-header">
          <div className="brand-logo-icon">📈</div>
          <div>
            <div className="brand-title">MarketLens</div>
            <div className="brand-tagline">Indian market intelligence</div>
          </div>
        </div>

        <div className="auth-left-content">
          <div className="live-market-badge">
            <span className="live-dot"></span> LIVE INDIAN MARKETS
          </div>

          <h1 className="auth-headline">{headline}</h1>
          <p className="auth-subheadline">{subheadline}</p>

          {/* Mini NIFTY 50 Card from Figma */}
          <div className="auth-market-card">
            <div className="market-card-top">
              <span className="market-index-label">NSE • NIFTY 50</span>
              <span className="market-pill-change">+0.82% today</span>
            </div>

            <div className="market-card-price">24,835.10</div>

            {/* SVG Sparkline Curve */}
            <div className="sparkline-wrapper">
              <svg viewBox="0 0 280 60" className="sparkline-svg">
                <defs>
                  <linearGradient id="niftyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 45 Q 30 50 60 38 T 120 40 T 170 20 T 220 30 T 270 12 L 270 60 L 0 60 Z"
                  fill="url(#niftyGradient)"
                />
                <path
                  d="M 0 45 Q 30 50 60 38 T 120 40 T 170 20 T 220 30 T 270 12"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <circle cx="270" cy="12" r="3" fill="#10b981" />
              </svg>
            </div>

            <div className="market-stats-row">
              <div className="stat-block">
                <span className="stat-label">ADVANCES</span>
                <span className="stat-val">1,642</span>
              </div>
              <div className="stat-block">
                <span className="stat-label">DECLINES</span>
                <span className="stat-val">874</span>
              </div>
              <div className="stat-block">
                <span className="stat-label">MARKET STATUS</span>
                <span className="stat-val status-open">Open</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-left-footer">
          <span>🛡️ Secure access</span>
          <span>•</span>
          <span>Educational tools</span>
          <span>•</span>
          <span>Paper trading with virtual funds</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right-panel">{children}</div>
    </div>
  );
}
