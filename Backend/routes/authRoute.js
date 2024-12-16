// routes/auth.js
import express from 'express';
import { register, registerValidation, login, logout, verifyTokenCheck } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // verifyToken and authenticate
import { sanitizeInput } from '../middlewares/sanitizeInput.js'; // To prevent SQL Injection
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register',
    sanitizeInput(['username', 'password', 'email', 'phoneNumber1', 'phoneNumber2', 'addressDistrict', 'addressCity', 'addressRoad', 'gender', 'birthday']),
    registerValidation,
    register
);
router.post('/login',
    sanitizeInput(['username', 'password']),
    //loginLimiter,
    login,
);
router.put('/logout',
    authenticate,
    logout
);
router.get('/verify-token', 
    authenticate, 
    verifyTokenCheck
);

export default router;
