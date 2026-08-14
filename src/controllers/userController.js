const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendError } = require("../utils/response");

const getProfile = async (req,res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return sendError(res, 404, "User not found");
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error) {
        console.error(error);
        
        return sendError(res, 500, "Internal server error");
    }
};

const updateProfile = async (req,res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return sendError(res, 400, "Name is required");
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                name
            },
            { new: true }
        );

        if(!user){
            return sendError(res, 404, "User not found");
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user:{
                id: user._id,
                name: user.name,
                email:user.email,
                updatedAt: user.updatedAt,
            }
        });
    } catch (error) {
        console.error(error);

        return sendError(res, 500, "Internal server error");
    }
};

const changePassword = async (req,res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return sendError(res, 400, "Current password and new password are required");
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return sendError(res, 404, "User not found");
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return sendError(res, 401, "Current paswword is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error(error);
        
        return sendError(res, 500, "Internal server error");
    }
};

const deleteAccount = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);

        if (!user) {
            return sendError(res, 404, "User not found");
        }

        return res.status(200).json({
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error(error);
        
        return sendError(res, 500, "Internal server error");
    }
}

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
}