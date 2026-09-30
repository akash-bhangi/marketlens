import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MarketOverview from "./MarketOverview";
import StockDetailsPage from "./StockDetailsPage";
import Register from "./Register";
import Login from "./Login";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function MainAppShell({ index, news, user, onLoginSuccess, onLogout }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content">
        <Header user={user} onLogout={onLogout} />
        <Routes>
          <Route path="/" element={<MarketOverview index={index} news={news} />} />
          <Route path="/stock/:symbol" element={<StockDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [index, setIndex] = useState([]);
  const [news, setNews] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    async function connectBackend() {
      try {
        const [indexResponse, newsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/index`).catch(() => null),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/news`).catch(() => null),
        ]);

        if (indexResponse && indexResponse.ok) {
          const indexData = await indexResponse.json();
          setIndex(indexData);
        }
        if (newsResponse && newsResponse.ok) {
          const newsData = await newsResponse.json();
          setNews(newsData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    connectBackend();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <MainAppShell
        index={index}
        news={news}
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;