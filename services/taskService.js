// In-memory data store
let tasks = [
    { id: 1, title: 'Learn Node.js', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Build REST API', completed: false, createdAt: new Date().toISOString() }
];
let nextId = 3;

const getAllTasks = async ({ completed, search }) => {
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

    return filteredTasks;
};

const getTaskById = async (id) => {
    return tasks.find(t => t.id === id);
};

const createTask = async ({ title, completed }) => {
    const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: completed === true,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    return newTask;
};

const updateTask = async (id, { title, completed }) => {
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return null;
    }

    const task = tasks[taskIndex];

    if (title !== undefined) {
        task.title = title.trim();
    }

    if (completed !== undefined) {
        task.completed = completed;
    }

    task.updatedAt = new Date().toISOString();
    return task;
};

const deleteTask = async (id) => {
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return null;
    }

    return tasks.splice(taskIndex, 1)[0];
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};

