const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory data store
let tasks = [
    { id: 1, title: 'Learn Node.js', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Build REST API', completed: false, createdAt: new Date().toISOString() }
];
let nextId = 3;

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Task Management API', 
        version: '1.0.0',
        endpoints: {
            'GET /api/tasks': 'Get all tasks',
            'GET /api/tasks/:id': 'Get a specific task',
            'POST /api/tasks': 'Create a new task',
            'PUT /api/tasks/:id': 'Update a task',
            'DELETE /api/tasks/:id': 'Delete a task'
        }
    });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const { completed, search } = req.query;
    let filteredTasks = [...tasks];

    if (completed !== undefined) {
        const isCompleted = completed === 'true';
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchLower)
        );
    }

    res.json(filteredTasks);
});

// Get a specific task
app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
    const { title, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: completed === true,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const { title, completed } = req.body;
    const task = tasks[taskIndex];

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title must be a non-empty string' });
        }
        task.title = title.trim();
    }

    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: 'Completed must be a boolean' });
        }
        task.completed = completed;
    }

    task.updatedAt = new Date().toISOString();
    res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json({ message: 'Task deleted successfully', task: deletedTask });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Task Management API listening at http://localhost:${port}`);
        console.log(`Visit http://localhost:${port} for API documentation`);
    });
}

module.exports = app;