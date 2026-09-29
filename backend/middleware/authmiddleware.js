const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            return res.status(401).json({ message: "Unauthorized access" })
        }

        const token = req.headers.authorization.split(" ")[1];
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodeToken.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token verification failed" });
    }

}

module.exports = { protect };