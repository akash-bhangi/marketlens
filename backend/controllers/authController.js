const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields." });
        }

        if (password.length < 7) {
            return res.status(400).json({ message: "Password must be atleast 7 characters." });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            virtualBalance: 1000000
        });

        res.status(200).json({
            messsage: "User registration success",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                virtualBalance: newUser.virtualBalance
            }
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occurred while registering" });
    }
}

module.exports = { registerUser }