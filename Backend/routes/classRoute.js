// routes/classRoute.js
import express from 'express';
import { classValidation, createNewClassFn, getAllClassesControllerFn, getClassByIdControllerFn, updateClassControllerFn, updateClassStatusControllerFn } from '../controllers/classController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // verifyToken and authenticate
import { sanitizeInput } from '../middlewares/sanitizeInput.js'; // To prevent SQL Injection

const router = express.Router();

router.post('/create',
    authenticate,
    sanitizeInput(['className', 'classDate', 'classStartDate', 'classDescription', 'location', 'classYear', 'type', 'classFee', 'freeCard', 'registrationFee', 'maxStudentCount', 'accessHaveUsersId']),
    classValidation,
    createNewClassFn
);

router.get('/',
    authenticate,
    getAllClassesControllerFn
);

router.get('/:classId',
    authenticate,
    getClassByIdControllerFn
);

router.put('/update/:classId',
    authenticate,
    sanitizeInput(['classId', 'className', 'classDate', 'classStartDate', 'classDescription', 'location', 'classYear', 'type', 'classFee', 'freeCard', 'registrationFee', 'maxStudentCount', 'accessHaveUsersId', 'active']),
    classValidation,
    updateClassControllerFn
);

router.put('/updateStatus/:classId/:active',
    authenticate,
    updateClassStatusControllerFn
);
export default router;