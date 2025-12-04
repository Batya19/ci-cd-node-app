const db = require('../config/database');

const getAllTasks = async ({ completed, search }) => {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (completed !== undefined) {
        const isCompleted = completed === 'true' ? 1 : 0;
        query += ' AND completed = ?';
        params.push(isCompleted);
    }

    if (search) {
        query += ' AND LOWER(title) LIKE ?';
        params.push(`%${search.toLowerCase()}%`);
    }

    query += ' ORDER BY createdAt DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map(row => ({
        id: row.id,
        title: row.title,
        completed: row.completed === 1,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt || null
    }));
};

const getTaskById = async (id) => {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    const row = stmt.get(id);

    if (!row) {
        return null;
    }

    return {
        id: row.id,
        title: row.title,
        completed: row.completed === 1,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt || null
    };
};

const createTask = async ({ title, completed }) => {
    const stmt = db.prepare('INSERT INTO tasks (title, completed, createdAt) VALUES (?, ?, ?)');
    const now = new Date().toISOString();
    const result = stmt.run(title.trim(), completed === true ? 1 : 0, now);

    return {
        id: result.lastInsertRowid,
        title: title.trim(),
        completed: completed === true,
        createdAt: now,
        updatedAt: null
    };
};

const updateTask = async (id, { title, completed }) => {
    const existingTask = await getTaskById(id);
    if (!existingTask) {
        return null;
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
        updates.push('title = ?');
        params.push(title.trim());
    }

    if (completed !== undefined) {
        updates.push('completed = ?');
        params.push(completed === true ? 1 : 0);
    }

    if (updates.length === 0) {
        return existingTask;
    }

    updates.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(id);

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...params);

    return await getTaskById(id);
};

const deleteTask = async (id) => {
    const task = await getTaskById(id);
    if (!task) {
        return null;
    }

    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);

    return task;
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};

