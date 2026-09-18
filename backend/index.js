require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./config/db");
const { getIndianBusinessNews } = require("./services/newsService");
const { getStockQuote, getStockIndex, getSearch } = require("./services/stockService");

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
        const stock = await getStockQuote(req.params.symbol);
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
        console.log("Fetching index quote...");
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
        const response = await getSearch(query);
        console.log(response);
        res.json(response);
    } catch (error) {
        req.status(error.response?.status || 502).json({
            msg: error.reponse?.message || error.message || "Unable to fetch the search results."
        })
    }

});


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
