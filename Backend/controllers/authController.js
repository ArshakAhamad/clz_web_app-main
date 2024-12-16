import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { createUser, getUserByUsername, getUserByEmail, updateUserToken } from '../models/User.js';
import { generateToken, verifyToken } from '../config/auth.js';
import { authenticate } from '../middlewares/authMiddleware.js';

// Validation for registration
export const registerValidation = [
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('roleId').isInt({ min: 1, max: 3 }).withMessage('Invalid role'), // Adjusted for roleId
    body('classId').optional().isInt({ min: 1 }).withMessage('Invalid classId'), // Added for classId
    body('email').isEmail().withMessage('Invalid email'),
    body('phoneNumber1').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    body('phoneNumber2').optional().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    body('addressDistrict').notEmpty().withMessage('District is required'),
    body('addressCity').notEmpty().withMessage('City is required'),
    body('addressRoad').notEmpty().withMessage('Road is required'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('birthday').optional().isDate().withMessage('Invalid birthday format (YYYY-MM-DD)'),
];

// Registration controller
export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, roleId, classId, email, phoneNumber1, phoneNumber2, addressDistrict, addressCity, addressRoad, gender, birthday } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const result = await createUser({
            username,
            password: hashedPassword,
            roleId,
            classId,
            email,
            phoneNumber1,
            phoneNumber2,
            addressDistrict,
            addressCity,
            addressRoad,
            gender,
            birthday,
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (err) {
        console.error('Error during registration:', err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Login controller
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Retrieve user details from the database
        const user = await getUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const tokenPayload = { userId: user.userId, roleId: user.roleId, username: user.username, email: user.email };
        let token = user.token;

        // Check if token is empty or expired
        let tokenExpired = false;
        if (token) {
            try {
                //jwt.verify(token, process.env.JWT_SECRET);
                verifyToken(token);
            } catch (err) {
                tokenExpired = true;
            }
        }
        // Generate and save a new token if it’s expired or empty
        if (!token || tokenExpired) {
            token = generateToken(tokenPayload);
            await updateUserToken(user.userId, token);  // Save the new token to the database
        }
        const payload = { userId: user.userId, roleId: user.roleId, username: user.username, email: user.email, token };
        // Set the token in a cookie with secure options
        res.cookie('accessToken', token, {
            httpOnly: true,      // Prevents client-side JavaScript access
            //secure: process.env.NODE_ENV === 'production',  // Enables secure cookies in production
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'strict',  // CSRF protection
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        });

        // Respond with success and token details
        res.status(200).json({ message: "Login successful", payload});
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// Logout controller
export const logout = async (req, res) => {
    try {
        await updateUserToken(req.user.userId, null); // Clear token in the database
        res.clearCookie('accessToken');
        res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to log out' });
    }
};

// verifyTokenCheck controller
export const verifyTokenCheck = (req, res) => {
    const { userId, roleId, username, email } = req;
    res.status(200).json({
        message: 'Token is valid',
        payload: { userId, roleId, username, email },
    });
};
