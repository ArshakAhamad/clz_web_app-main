import express from 'express';
import { generateAndSaveQRCodes, getAllQRCodesFn, getQRCodeByCodeFn, updateQRCodeStatusFn } from '../controllers/qrCodeController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { sanitizeInput } from '../middlewares/sanitizeInput.js';

const router = express.Router();

// Generate new QR codes
router.post(
  '/generate',
  sanitizeInput(['qrQuantity', 'type']),
  authenticate,
  generateAndSaveQRCodes
);

// Fetch details of a specific QR code
router.get(
  '/qrDetails/:qrCode',
  authenticate,
  getQRCodeByCodeFn
);

// Fetch all QR codes
router.get(
  '/',
  authenticate,
  getAllQRCodesFn
);

// Update the status of a QR code
router.put(
  '/updateStatus/:qrCode/:active',
  authenticate,
  updateQRCodeStatusFn
);

export default router;
