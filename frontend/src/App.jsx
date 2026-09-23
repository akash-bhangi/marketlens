import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MarketOverview from "./MarketOverview";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StockDetailsPage from "./StockDetailsPage"

function App() {
  const [index, setIndex] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function connectBackend() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }
        const indexResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/index`
        );
        if (!indexResponse.ok) {
          throw new Error("Failed to fetch index");
        }
        const newsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/news`
        );
        if (!newsResponse.ok) {
          throw new Error("Failed to fetch news");
        }
        const indexData = await indexResponse.json();
        const newsData = await newsResponse.json();
        setIndex(indexData);
        setNews(newsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    connectBackend();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<MarketOverview index={index} news={news} />} />
            <Route path="/stock/:symbol" element={<StockDetailsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;