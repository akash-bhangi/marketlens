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
        res.status(502).json(
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

        const existingStock = await WatchList.findOne({
            user: req.user.id,
            name: name
        });

        if (existingStock) {
            return res.status(400).json({ message: "Stock is already added to the watchlist" });
        }

        const newStock = new WatchList({
            user: req.user.id,
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
        res.status(502).json(
            {
                message: error.response?.data?.message || error.message || "Error occured while adding stock to watchlist",
            }
        )
    }

}

const deleteFromWatchList = async (req, res) => {
    try {
        const stockId = req.params.id;
        if (!stockId) {
            return res.status(400).json({ message: "Stock ID is required" });
        }

        const deletedStock = await WatchList.findByIdAndDelete(stockId);

        if (!deletedStock) {
            return res.status(404).json({ message: "Stock not found in watchlist" });
        }

        return res.status(200).json({ message: "Stock deleted from watchlist successfully" });

    }
    catch (error) {
        res.status(502).json(
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