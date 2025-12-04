const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'tasks.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tasks table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT
    )
`);

// Initialize with sample data if table is empty
const rowCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
if (rowCount.count === 0) {
    const insert = db.prepare('INSERT INTO tasks (title, completed, createdAt) VALUES (?, ?, ?)');
    const now = new Date().toISOString();
    insert.run('Learn Node.js', 0, now);
    insert.run('Build REST API', 0, now);
}

module.exports = db;

