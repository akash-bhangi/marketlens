const Portfolio = require("../models/Portfolio.js");
const User = require("../models/User.js")
const Transaction = require("../models/Transaction.js")
const { getStockQuote } = require("../services/stockService");

const buyStock = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is required." });
        }

        const { symbol, name, exchange, quantity, price } = req.body;
        const qty = Number(quantity);
        const buyPrice = Number(price);

        if (!symbol || !name || isNaN(qty) || qty <= 0 || isNaN(buyPrice) || buyPrice <= 0) {
            return res.status(400).json({ success: false, message: "Invalid order parameters." });
        }

        const totalCost = qty * buyPrice;
        const userId = req.user?._id || req.user?.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.virtualBalance < totalCost) {
            return res.status(400).json({
                success: false,
                message: `Insufficient virtual funds. Available: ₹${user.virtualBalance.toLocaleString("en-IN")}, Required: ₹${totalCost.toLocaleString("en-IN")}`
            });
        }

        user.virtualBalance -= totalCost;
        await user.save();

        let holding = await Portfolio.findOne({ user: userId, symbol });

        if (holding) {
            const previousInvested = holding.totalInvested;
            const previousQuantity = holding.quantity;
            const totalInvested = previousInvested + totalCost;
            const totalQuantity = previousQuantity + qty;
            const avgPrice = totalInvested / totalQuantity;

            holding.quantity = totalQuantity;
            holding.averagePrice = avgPrice;
            holding.totalInvested = totalInvested;
            await holding.save();

        } else {
            holding = new Portfolio({
                user: userId,
                symbol,
                name,
                exchange: exchange || "NSE",
                quantity: qty,
                averagePrice: buyPrice,
                totalInvested: totalCost,
            });
            await holding.save();
        }

        const transaction = new Transaction({
            user: userId,
            symbol,
            name,
            type: "BUY",
            quantity: qty,
            price: buyPrice,
            totalAmount: totalCost,
        });

        await transaction.save();

        res.status(200).json({
            success: true,
            message: "Stock bought successfully!",
            holding: holding,
            transaction,
            user: {
                id: user._id,
                name: user.name,
                virtualBalance: user.virtualBalance,
            }
        });

    } catch (error) {
        console.error("Error while buying stock", error.message);
        res.status(500).json({ success: false, message: "Internal server error while buying stock" });
    }
};


const sellStock = async (req, res) => {
    try {
        const { symbol, quantity, price } = req.body;
        const qty = Number(quantity);
        const sellPrice = Number(price);

        if (!symbol || isNaN(qty) || qty <= 0 || isNaN(sellPrice) || sellPrice <= 0) {
            return res.status(400).json({ success: false, message: "Invalid sell parameters." });
        }

        const holding = await Portfolio.findOne({ user: req.user._id, symbol });
        if (!holding || holding.quantity < qty) {
            return res.status(400).json({
                success: false,
                message: `Insufficient holdings. You own ${holding ? holding.quantity : 0} shares, but tried to sell ${qty}.`
            });
        }

        const proceeds = qty * sellPrice;
        const user = await User.findById(req.user._id);
        user.virtualBalance += proceeds;

        await user.save();

        let updatedHolding = null;

        if (holding.quantity === qty) {
            await Portfolio.findByIdAndDelete(holding._id);
        } else {
            holding.quantity -= qty;
            holding.totalInvested = holding.quantity * holding.averagePrice;
            updatedHolding = await holding.save();
        }

        const transaction = await Transaction.create({
            user: req.user._id,
            symbol,
            name: holding.name,
            type: "SELL",
            quantity: qty,
            price: sellPrice,
            totalAmount: proceeds
        });

        res.status(200).json({
            success: true,
            message: `Successfully sold ${qty} shares of ${symbol}`,
            holding: updatedHolding,
            transaction,
            remainingBalance: user.virtualBalance
        });
    } catch (error) {
        console.error("Error in sellStock:", error);
        res.status(500).json({ success: false, message: "Server error processing sell order." });
    }
};

const getPortfolio = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("virtualBalance");
        const holdings = await Portfolio.find({ user: req.user._id });

        const enrichedHoldings = await Promise.all(
            holdings.map(async (holding) => {
                let currentPrice = holding.averagePrice;
                let dayChange = 0;
                let dayChangePercent = 0;

                try {
                    const quote = await getStockQuote(holding.symbol);
                    if (quote && quote.price) {
                        currentPrice = quote.price;
                        dayChange = quote.change || 0;
                        dayChangePercent = quote.changePercent || 0;
                    }
                } catch (err) {
                    console.warn(`Could not fetch live price for ${holding.symbol}, fallback to avgPrice`);
                }

                const currentValue = holding.quantity * currentPrice;
                const profitAndLoss = currentValue - holding.totalInvested;
                const profitAndLossPercentage = holding.totalInvested > 0
                    ? (profitAndLoss / holding.totalInvested) * 100
                    : 0;

                return {
                    _id: holding._id,
                    symbol: holding.symbol,
                    name: holding.name,
                    exchange: holding.exchange,
                    quantity: holding.quantity,
                    averagePrice: holding.averagePrice,
                    totalInvested: holding.totalInvested,
                    currentPrice,
                    currentValue,
                    dayChange,
                    dayChangePercent,
                    profitAndLoss,
                    profitAndLossPercentage
                };
            })
        );
        const totalInvested = enrichedHoldings.reduce((sum, h) => sum + h.totalInvested, 0);
        const totalCurrentValue = enrichedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
        const totalProfitAndLoss = totalCurrentValue - totalInvested;
        const totalProfitAndLossPercentage = totalInvested > 0 ? (totalProfitAndLoss / totalInvested) * 100 : 0;
        const virtualBalance = user ? user.virtualBalance : 0;
        const netWorth = totalCurrentValue + virtualBalance;

        res.status(200).json({
            success: true,
            summary: {
                totalInvested,
                totalCurrentValue,
                totalProfitAndLoss,
                totalProfitAndLossPercentage,
                virtualBalance,
                netWorth
            },
            holdings: enrichedHoldings
        });
    } catch (error) {
        console.error("Error in getPortfolio:", error);
        res.status(500).json({ success: false, message: "Server error fetching portfolio." });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        console.error("Error in getTransactions:", error);
        res.status(500).json({ success: false, message: "Server error fetching transactions." });
    }
};

module.exports = { buyStock, sellStock, getPortfolio, getTransactions };