import bcrypt from 'bcrypt';
import { createUser, getRoles, getUsers, getUserById, updateUser, getUserByUsername, getUserByEmail } from "../models/User.js";
import { body, validationResult } from 'express-validator';

// validate user data
export const validateUserData = [
    body('username').isString().isLength({ min: 3, max: 50 }),
    body('password').isString().isLength({ min: 6, max: 50 }),
    body('email').isEmail(),
    body('roleId').isInt(),
    body('phoneNumber1').isString().isLength({ min: 10, max: 20 }),
    body('addressDistrict').isString().isLength({ min: 3, max: 100 }),
    body('addressCity').isString().isLength({ min: 3, max: 100 }),
    body('addressRoad').isString().isLength({ min: 3, max: 100 }),
    body('gender').isString().isLength({ min: 4, max: 6 }),
    body('birthday').isDate(),
];

// Controller to create a new user
export const createNewUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let userData = req.body;

        // Check if the username already exists
        const existingUser = await getUserByUsername(req.body.username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        const existingEmail = await getUserByEmail(req.body.email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already taken' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        const newUser = await createUser(userData);
        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json({ data: users });
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: 'Error getting all users', error });
    }
};

// Controller to update a user
export const updateUserFn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.userId;
    const { username, email } = req.body;

    try {
        // Check if the username already exists for another user
        const existingUser = await getUserByUsername(username);
        //If the input string starts with 0x, parseInt might treat it as a hexadecimal number (base 16) without a radix(Ex:10).
        //Similarly, a leading 0 might be interpreted as an octal (base 8) number in non-strict modes of older JavaScript engines.
        if (existingUser && existingUser.userId !== parseInt(userId, 10)) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Check if the email already exists for another user
        const existingEmail = await getUserByEmail(email);
        if (existingEmail && existingEmail.userId !== parseInt(userId, 10)) {
            return res.status(400).json({ error: 'Email already taken' });
        }

        // Proceed with the update
        const userData = req.body;
        await updateUser(userId, userData);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};


// Get userbyid
export const getUserByIdControllerFn = async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        res.status(200).json({ data: user });
    } catch (error) {
        console.error('Error getting user by id:', error);
        res.status(500).json({ message: 'Error getting user by id', error });
    }
};

// Controller to get all roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await getRoles();
        res.status(200).json({ data: roles });
    } catch (error) {
        console.error('Error getting all roles:', error);
        res.status(500).json({ message: 'Error getting all roles', error });
    }
};