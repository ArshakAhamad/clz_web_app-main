import { createPayment, getAllPayments, getPaymentById, updatePayment } from "../models/Payment.js";
import { getStudentByQRCode } from "../models/Student.js";
import { body, validationResult } from 'express-validator';

// Validation rules
export const paymentValidation = [
    body('studentId').isInt({ min: 1 }).withMessage('Invalid student ID'),
    body('classId').isInt({ min: 1 }).withMessage('Invalid class ID'),
    body('studentQRCode').isString().withMessage('Invalid QR code'),
    body('paymentType').isIn(['registration', 'monthly']).withMessage('Invalid payment type(only registration or monthly)'),
    body('amount').isDecimal({ min: 0.00 }).withMessage('Invalid amount'),
    body('paymentDate').isDate().withMessage('Invalid payment date'),
    body('paymentMonth').isIn(['january','february','march','april','may','june','july','august','september','october','november','december']).withMessage('Invalid payment month'),
    body('createdBy').isInt({ min: 1 }).withMessage('Invalid user ID'),
];

// Controller to create a new Payment, if student.freeCard is true, then the payment amount is 0.00
export const createPaymentFn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const paymentData = req.body;
    const student = await getStudentByQRCode(paymentData.studentQRCode);

    if (student.freeCard === 1) {
        paymentData.amount = 0.00;
    }

    try {
        const paymentId = await createPayment(paymentData);
        return res.status(200).json({ message: 'Payment created successfully', paymentId });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Controller to get all payments
export const getAllPaymentsControllerFn = async (req, res) => {
    try {
        const payments = await getAllPayments();
        return res.status(200).json(payments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Controller to get payment by ID
export const getPaymentByIdControllerFn = async (req, res) => {
    const paymentId = req.params.paymentId;
    try {
        const payment = await getPaymentById(paymentId);
        return res.status(200).json(payment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Controller to get the payments by student ID
export const getPaymentsByStudentIdControllerFn = async (req, res) => {
    const studentId = req.params.studentId;
    try {
        const payments = await getPaymentsByStudentId(studentId);
        return res.status(200).json(payments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Controller to update payment details
export const updatePaymentDetailsFn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const paymentData = req.body;
    try {
        await updatePayment(paymentData);
        return res.status(200).json({ message: 'Payment updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};