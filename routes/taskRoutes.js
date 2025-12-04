const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask, validateTaskUpdate, validateId } = require('../middleware/validation');

router.get('/', taskController.getAllTasks);
router.get('/:id', validateId, taskController.getTaskById);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateId, validateTaskUpdate, taskController.updateTask);
router.delete('/:id', validateId, taskController.deleteTask);

module.exports = router;

