import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MarketOverview from "./MarketOverview";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking API...");
  const [index, setIndex] = useState([]);

  useEffect(() => {
    async function connectBackend() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard`
        );
        const indexResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/index`
        );
        const data = await response.json();
        const indexData = await indexResponse.json();
        setBackendStatus(data.msg);
        setIndex(indexData);
      } catch {
        setBackendStatus("API unavailable");
      }
    }

    connectBackend();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content" style={{ marginLeft: "250px", padding: "1.5rem" }}>
        <Header backendStatus={backendStatus} />
        <MarketOverview index={index} />
      </main>
    </div>
  );
}

export default App;