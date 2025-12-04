const request = require('supertest');
const app = require('../app');

describe('Root endpoint', () => {
    it('should return API information', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Task Management API');
        expect(res.body.endpoints).toBeDefined();
    });
});

describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter tasks by completed status', async () => {
        const res = await request(app).get('/api/tasks?completed=false');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach(task => {
            expect(task.completed).toBe(false);
        });
    });

    it('should search tasks by title', async () => {
        const res = await request(app).get('/api/tasks?search=Node');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /api/tasks/:id', () => {
    it('should return a specific task', async () => {
        const res = await request(app).get('/api/tasks/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBeDefined();
    });

    it('should return 404 for non-existent task', async () => {
        const res = await request(app).get('/api/tasks/999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Task not found');
    });
});

describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
        const newTask = { title: 'Test Task', completed: false };
        const res = await request(app)
            .post('/api/tasks')
            .send(newTask);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toBe('Test Task');
        expect(res.body.id).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({ completed: false });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors.length).toBeGreaterThan(0);
        expect(JSON.stringify(res.body.errors)).toContain('Title is required');
    });

    it('should return 400 if title is empty', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({ title: '', completed: false });
        
        expect(res.statusCode).toEqual(400);
    });
});

describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
        const updateData = { title: 'Updated Task', completed: true };
        const res = await request(app)
            .put('/api/tasks/1')
            .send(updateData);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('Updated Task');
        expect(res.body.completed).toBe(true);
        expect(res.body.updatedAt).toBeDefined();
    });

    it('should return 404 for non-existent task', async () => {
        const res = await request(app)
            .put('/api/tasks/999')
            .send({ title: 'Test' });
        
        expect(res.statusCode).toEqual(404);
    });

    it('should return 400 if title is invalid', async () => {
        const res = await request(app)
            .put('/api/tasks/1')
            .send({ title: '' });
        
        expect(res.statusCode).toEqual(400);
    });
});

describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
        // First create a task to delete
        const createRes = await request(app)
            .post('/api/tasks')
            .send({ title: 'Task to Delete' });
        
        const taskId = createRes.body.id;
        
        const res = await request(app).delete(`/api/tasks/${taskId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Task deleted successfully');
    });

    it('should return 404 for non-existent task', async () => {
        const res = await request(app).delete('/api/tasks/999');
        expect(res.statusCode).toEqual(404);
    });
});

describe('GET /health', () => {
    it('should return health status', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('healthy');
        expect(res.body.database).toBe('connected');
        expect(res.body.timestamp).toBeDefined();
    });
});

describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/unknown-route');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Route not found');
    });
});