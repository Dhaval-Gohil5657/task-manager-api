const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return sendError(res, 400, "Name, email and password are required");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return sendError(res, 400, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error(error);

        return sendError(res, 500, "Internal server error");
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 400, "Email and password are required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return sendError(res, 404, "User not found");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return sendError(res, 401, "Invalid password");
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return sendError(res, 500, "Internal server error");
    }
};

module.exports = {
    registerUser,
    loginUser,
}

// const registerUser = (req,res) => {
//     const {name,email,password} = req.body;

//     res.json({
//         message: "Data received successfully",
//         name,
//         email,
//         password
//     });
// };