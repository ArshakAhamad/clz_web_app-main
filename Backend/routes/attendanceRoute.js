import express from 'express';
import { 
    attendanceValidation, 
    createNewAttendanceFn, 
    getAllAttendanceControllerFn, 
    getAttendanceByIdControllerFn,
    updateAttendanceFn } from '../controllers/attendanceController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // verifyToken and authenticate
import { sanitizeInput } from '../middlewares/sanitizeInput.js'; // To prevent SQL Injection

const router = express.Router();

router.post('/mark-attendance',
    authenticate,
    sanitizeInput(['studentId', 'studentQRCode', 'classId', 'attendanceDate']),
    attendanceValidation,
    createNewAttendanceFn
);

router.get('/',
    authenticate,
    getAllAttendanceControllerFn
);

router.get('/:attendanceId',
    authenticate,
    getAttendanceByIdControllerFn
);

router.put('/update/:attendanceId',
    authenticate,
    sanitizeInput(['studentId', 'studentQRCode', 'classId', 'attendanceDate']),
    updateAttendanceFn
);

export default router;