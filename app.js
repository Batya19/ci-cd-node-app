require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const db = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Task Management API', 
        version: '1.0.0',
        endpoints: {
            'GET /health': 'Health check',
            'GET /api/tasks': 'Get all tasks',
            'GET /api/tasks/:id': 'Get a specific task',
            'POST /api/tasks': 'Create a new task',
            'PUT /api/tasks/:id': 'Update a task',
            'DELETE /api/tasks/:id': 'Delete a task'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    try {
        // Check database connection
        db.prepare('SELECT 1').get();
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
});

app.use('/api/tasks', taskRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Task Management API listening at http://localhost:${port}`);
        console.log(`Visit http://localhost:${port} for API documentation`);
    });
}

module.exports = app;