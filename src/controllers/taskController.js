const Task = require("../models/Task")

const createTask = async (req,res) => {
    try {
        const {title, description, status} = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required",
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            user: req.userId
        });

        return res.status(201).json({
            message: "Task created successfully",
            task,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getTasks = async (req,res) => {
    try {
        const tasks = await Task.find(
            { user: req.userId }
        );

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getTaskById = async (req,res) => {
    try {
        const {id} = req.params;

        const task = await Task.findOne({
            _id : id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            task,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
        
    }
};

const updateTask = async (req,res) => {
    try {
        const {id} = req.params;

        const { title, description,status } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.userId
            },
            {
                title,
                description,
                status
            },
            {
                returnDocument: "after",
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const deleteTask = async (req,res) => {
    try {
        const {id} = req.params;

        const task= await Task.findOneAndDelete({
                _id: id,
                user: req.userId
        })
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
}