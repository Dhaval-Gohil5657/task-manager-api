const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req,res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
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
        
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};

const updateProfile = async (req,res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                name
            },
            { new: true }
        );

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
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

        return res.status(500).json({
            message: "Internal server error"
         });
    }
};

const changePassword = async (req,res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Current paswword is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteAccount = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error(error);
        
        return res.status(200).json({
            message: "Password changed successfully"
        });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
}