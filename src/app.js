const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Auth API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRoutes)

module.exports = app;