import express from 'express';
import { 
    studentValidation, 
    createOrEnrollStudentFn, 
    getAllStudentsControllerFn, 
    getStudentByIdControllerFn, 
    getStudentByQRCodeControllerFn, 
    updateStudentDetailsFn, 
    updateStudentQRCodeByPartialNameFn,
    updateStudentQRCodeFn } from '../controllers/studentController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // verifyToken and authenticate
import { sanitizeInput } from '../middlewares/sanitizeInput.js'; // To prevent SQL Injection

const router = express.Router();

// create new student
router.post('/create-new',
    authenticate,
    sanitizeInput(['name', 'email', 'gender', 'addressDistrict', 'addressCity', 'addressRoad', 'roleId', 'registeredDate', 'birthDay', 'phoneNumber1', 'phoneNumber2', 'classId', 'studentQRCode', 'freeCard']),
    studentValidation,
    createOrEnrollStudentFn
);
// get all students
router.get('/',
    authenticate,
    getAllStudentsControllerFn
);
// get student details by student id
router.get('/:studentId',
    authenticate,
    getStudentByIdControllerFn
);
// get student details by qr code
router.get('/qr/:studentQRCode',
    authenticate,
    getStudentByQRCodeControllerFn
);
// Update student details without qr code updates
router.put('/update/:studentId',
    authenticate,
    sanitizeInput(['name', 'email', 'gender', 'addressDistrict', 'addressCity', 'addressRoad', 'registeredDate', 'birthDay', 'phoneNumber1', 'phoneNumber2', 'freeCard']),
    updateStudentDetailsFn
);
// When completely misplaced qr code
router.put('/update-qr',
    authenticate,
    sanitizeInput(['newQRCode', 'partialName', 'birthDay', 'phoneNumber1']),
    updateStudentQRCodeByPartialNameFn
);
// when needs to renew qr code
router.put('/update/qr/:studentId',
    authenticate,
    sanitizeInput(['studentQRCode']),
    updateStudentQRCodeFn
);
export default router;