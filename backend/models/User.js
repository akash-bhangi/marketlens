const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address."],
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: [6, "Password must be at least 6 characters long."]
        },
        virtualBalance: {
            type: Number,
            default: 1000000,
        },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;