const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        symbol: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        exchange: {
            type: String,
            required: true,
            trim: true,
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("WatchList", watchListSchema);