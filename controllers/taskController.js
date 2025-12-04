const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');

const getAllTasks = async (req, res, next) => {
    try {
        const { completed, search } = req.query;
        const tasks = await taskService.getAllTasks({ completed, search });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const task = await taskService.getTaskById(id);
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, completed } = req.body;
        const newTask = await taskService.createTask({ title, completed });
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);
        const { title, completed } = req.body;
        
        const task = await taskService.updateTask(id, { title, completed });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const deletedTask = await taskService.deleteTask(id);
        
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};

