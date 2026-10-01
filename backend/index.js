require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./config/db");
const { getIndianBusinessNews } = require("./services/newsService");
const { getStockQuote, getStockIndex, getSearch, getStockHistory } = require("./services/stockService");
const authRouter = require("./routes/authRoutes.js");
const watchListRoutes = require("./routes/watchListRoutes.js");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));



app.get("/api/dashboard", (req, res) => {
    res.json({ msg: "Backend is Connected!" });
})

app.get("/api/news", async (req, res) => {
    try {
        const articles = await getIndianBusinessNews();
        res.json(articles);
    } catch (error) {
        res.status(error.response?.status || 502).json({
            message: error.response?.data?.message || error.message || "Unable to fetch the news.",
        })
    }

})

app.get("/api/stock/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol;
        if (!symbol) {
            return res.status(400).json({ message: "Stock symbol is required." });
        }
        const stock = await getStockQuote(symbol);
        res.json(stock);
    } catch (error) {
        console.error("Error fetching stock quote:", error.response?.data || error.message);
        res.status(error.response?.status || 502).json({
            message: error.response?.data?.message || error.message || "Unable to fetch the stock quote.",
        });
    }
});

app.get("/api/index", async (req, res) => {
    try {
        const index = await getStockIndex();
        res.json(index);
    } catch (error) {
        console.error("Error fetching index quote:", error.response?.data || error.message);
        res.status(error.response?.status || 502).json({
            message: error.response?.data?.message || error.message || "Unable to fetch the index quote.",
        });
    }
})
app.get("/api/search", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.json([]);
        }
        const response = await getSearch(query);
        res.json(response);
    } catch (error) {
        res.status(error.response?.status || 502).json({
            message: error.response?.data?.message || error.message || "Unable to fetch the search results."
        })
    }

});

app.get("/api/stock/:symbol/history", async (req, res) => {
    try {
        const symbol = req.params.symbol;
        if (!symbol) {
            return res.status(400).json({ message: "Stock Symbol is required." })
        }
        const queryRange = req.query.range || "1M";
        const history = await getStockHistory(symbol, queryRange);
        res.json(history);
    }
    catch (error) {
        console.log("Error ocuured during accessing of Stock History", error.response?.data || error.message);
        res.status(error.response?.status || 502).json({
            message: error.response?.data?.message || error.message || "Unable to fetch the stock history.",
        })
    }
})

app.use("/api/auth", authRouter);
app.use("/api/watchlist", watchListRoutes);

async function startServer() {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });

    } catch (err) {
        console.log("MongoDB failed to connect " + err);
    }
}

startServer();
