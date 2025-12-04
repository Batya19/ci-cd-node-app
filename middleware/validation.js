const { body, param } = require('express-validator');

const validateTask = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required and must be a non-empty string')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean')
];

const validateTaskUpdate = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title must be a non-empty string')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean')
];

const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer')
];

module.exports = {
    validateTask,
    validateTaskUpdate,
    validateId
};

