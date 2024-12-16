import express from 'express';
import { paymentValidation, createPaymentFn, getAllPaymentsControllerFn, getPaymentByIdControllerFn, updatePaymentDetailsFn, getPaymentsByStudentIdControllerFn } from '../controllers/paymentController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // verifyToken and authenticate
import { sanitizeInput } from '../middlewares/sanitizeInput.js'; // To prevent SQL Injection

const router = express.Router();

router.post('/create',
    authenticate,
    sanitizeInput(['studentId', 'classId', 'studentQRCode', 'amount', 'paymentDate', 'paymentType', 'paymentMonth', 'createdBy']),
    paymentValidation,
    createPaymentFn
);

router.get('/',
    authenticate,
    getAllPaymentsControllerFn
);

router.get('/:paymentId',
    authenticate,
    getPaymentByIdControllerFn
);

router.get('/student/:studentId',
    authenticate,
    getPaymentsByStudentIdControllerFn
);
router.put('/update/:paymentId',
    authenticate,
    sanitizeInput(['studentQRCode', 'amount', 'paymentDate', 'paymentType', 'paymentMonth', 'createdBy']),
    updatePaymentDetailsFn
);

export default router;