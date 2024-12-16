// middlewares/sanitizeInput.js
import { body } from 'express-validator';

export const sanitizeInput = (fields) => {
    return fields.map(field => body(field).trim().escape());
};

