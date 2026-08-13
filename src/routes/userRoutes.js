const express = require("express");

const router = express.Router();

const { 
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile",authMiddleware,getProfile);
router.put("/profile",authMiddleware,updateProfile);
router.put("/change-password",authMiddleware,changePassword);
router.delete("/delete-account",authMiddleware,deleteAccount);

module.exports = router;