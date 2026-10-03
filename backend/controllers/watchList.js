const mongoose = require("mongoose");
const WatchList = require("../models/WatchList");

const getWatchList = async (req, res) => {
    try {
        const watchList = await WatchList.find({ user: req.user._id });

        if (watchList.length === 0) {
            return res.status(200).json({ message: "Watchlist is empty", watchlist: [] });
        }

        return res.status(200).json({ message: "Watchlist fetched successfully", watchlist: watchList });

    }
    catch (error) {
        res.status(500).json(
            {
                message: error.response?.data?.message || error.message || "Error occured while fetching watchlist",
            }
        )
    }
}

const addTOWatchList = async (req, res) => {
    try {
        const { symbol, name, exchange } = req.body;

        if (!symbol || !name) {
            return res.status(400).json({ message: "All fields are required to add in watchlist" });
        }

        const upperSymbol = symbol.toUpperCase();
        const altSymbol = upperSymbol.endsWith(".NS")
            ? upperSymbol.replace(".NS", "")
            : `${upperSymbol}.NS`;

        const existingStock = await WatchList.findOne({
            user: req.user._id,
            symbol: { $in: [upperSymbol, altSymbol] }
        });

        if (existingStock) {
            return res.status(400).json({ message: "Stock is already added to the watchlist" });
        }

        const newStock = new WatchList({
            user: req.user._id,
            name: name,
            symbol: symbol,
            exchange: exchange || "NSE"
        });

        const response = await newStock.save();

        if (response) {
            return res.status(201).json({ message: "Stock added to watchlist successfully", stock: response });
        }

        return res.status(500).json({ message: "Failed to add stock to watchlist" });

    } catch (error) {
        res.status(500).json(
            {
                message: error.response?.data?.message || error.message || "Error occured while adding stock to watchlist",
            }
        )
    }

}

const deleteFromWatchList = async (req, res) => {
    try {
        const stockIdOrSymbol = req.params.id;
        if (!stockIdOrSymbol) {
            return res.status(400).json({ message: "Stock ID or Symbol is required" });
        }

        let deletedStock = null;

        // 1. Try deleting by MongoDB _id if valid
        if (mongoose.Types.ObjectId.isValid(stockIdOrSymbol)) {
            deletedStock = await WatchList.findOneAndDelete({
                user: req.user._id,
                _id: stockIdOrSymbol
            });
        }

        // 2. Otherwise try deleting by stock symbol (e.g. "RELIANCE" or "RELIANCE.NS")
        if (!deletedStock) {
            const upperSymbol = stockIdOrSymbol.toUpperCase();
            const altSymbol = upperSymbol.endsWith(".NS")
                ? upperSymbol.replace(".NS", "")
                : `${upperSymbol}.NS`;

            deletedStock = await WatchList.findOneAndDelete({
                user: req.user._id,
                symbol: { $in: [upperSymbol, altSymbol] }
            });
        }

        if (!deletedStock) {
            return res.status(404).json({ message: "Stock not found in watchlist" });
        }

        return res.status(200).json({ message: "Stock deleted from watchlist successfully" });

    }
    catch (error) {
        res.status(500).json(
            {
                message: error.response?.data?.message || error.message || "Error occured while deleting stock from watchlist",
            }
        )
    }
}

module.exports = {
    addTOWatchList,
    getWatchList,
    deleteFromWatchList
}