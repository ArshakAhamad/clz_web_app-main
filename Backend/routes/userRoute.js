import express from 'express';
import { 
    validateUserData, 
    createNewUser, 
    getAllUsers, 
    getUserByIdControllerFn,
    updateUserFn,
    getAllRoles } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // verifyToken and authenticate
import { sanitizeInput } from '../middlewares/sanitizeInput.js'; // To prevent SQL Injection

const router = express.Router();

router.post('/create-new',
    authenticate,
    sanitizeInput(['username', 'password', 'email', 'roleId', 'phoneNumber1', 'phoneNumber2', 'addressDistrict', 'addressCity', 'addressRoad', 'gender', 'birthday']),
    validateUserData,
    createNewUser
);

router.get('/',
    authenticate,
    getAllUsers
);

router.put('/update/:userId',
    authenticate,
    sanitizeInput(['username', 'email', 'roleId', 'phoneNumber1', 'phoneNumber2', 'addressDistrict', 'addressCity', 'addressRoad', 'gender', 'birthday']),
    updateUserFn
);

router.get('/roles',
    authenticate,
    getAllRoles
);

router.get('/:userId',
    authenticate,
    getUserByIdControllerFn
);

export default router;