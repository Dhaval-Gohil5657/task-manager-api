const Task = require("../models/Task");
const mongoose = require("mongoose");

const createTask = async (req,res) => {
    try {
        const {title, description, status} = req.body;

        if (!title || !title.trim()) {
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

        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map((err) => err.message);

            return res.status(400).json({
                message,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getTasks = async (req,res) => {
    try {
        const { status, sort, page, limit, search } = req.query;

        const validStatuses = ["pending", "in-progress", "completed"];

        const validSortOptions = ["newest", "oldest"];

        const pageNumber = page? Number(page) : 1;
        const limitNumber = limit? Number(limit) : 10;
        const skip = (pageNumber - 1) * limitNumber;

        if (
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1
        ) {
            return res.status(400).json({
                message: "Page and limit must be positive integers",
            });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            });
        }
        
        if (sort && !validSortOptions.includes(sort)) {
            return res.status(400).json({
                message: "Invalid sort option",
            });
        }
        
        const filter = {
            user: req.userId
        };

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        let sortOption = { createdAt: -1 };

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        const totalTasks = await Task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / limitNumber);

        // Fetch Tasks //
        const tasks = await Task.find(filter).sort(sortOption).skip(skip).limit(limitNumber);

        if (tasks.length === 0) {
            return res.status(404).json({
                message: "No tasks found",
                tasks: [],
            });
        }
           
        return res.status(200).json({
            message: "Tasks fetched successfully",
            pagination: {
                totalTasks,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
            tasks,
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task Id"
            });
        }

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task Id"
            });
        }

        const { title, description,status } = req.body;

        const updateData = {};

        if (title !== undefined) {
            if(!title.trim()){
                return res.status(400).json({
                    message: "Title cannot be empty",
                });
            }

            updateData.title = title;
        }

        if (description !== undefined) {
            updateData.description = description;
        }
        
        if (status !== undefined) {
            updateData.status = status;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "At least one field is required to update",
            });
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.userId
            },
            updateData,
            {
                returnDocument: "after",
                runValidators: true,
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

        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map((err) => err.message);

            return res.status(400).json({
                message,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const deleteTask = async (req,res) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task Id"
            });
        }

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