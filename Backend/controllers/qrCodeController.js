import { saveQRCode, getAllQRCodes, getQRCodeByCode, updateQRCodeStatus } from '../models/QRCode.js';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';

// Validate the request body
export const qrValidation = [
    body('qrQuantity').isInt({ min: 1 }).withMessage('Invalid quantity'),
    body('type').isIn(['student', 'class']).withMessage('Invalid type'),
];

// Controller to generate and save QR codes
export const generateAndSaveQRCodes = async (req, res) => {
    const { qrQuantity, type } = req.body;
    const createdByUserId = req.user.userId;
    const createdByUsername = req.user.username;
    
    // Fix the authorization check using `&&`
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Generate unique codes based on the requested quantity
        const uniqueCodes = Array.from({ length: qrQuantity }, () => uuidv4());
        //const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Get the current date in the local timezone formatted as YYYY-MM-DD
        const now = new Date();
        const currentDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0]; // Format as YYYY-MM-DD
        const savedCodes = [];
        
        // Save each unique code to the database
        for (const code of uniqueCodes) {
            const qrData = {
                qrCode: code,
                qrQuantity,
                createDate: currentDate,
                createdByUserId,
                createdByUsername,
                type,
            };
            
            const qrId = await saveQRCode(qrData);
            savedCodes.push({ qrId, ...qrData });
        }

        // Return a successful response with the saved codes
        res.status(201).json({ message: "QR Codes generated and saved successfully", data: savedCodes });
    } catch (error) {
        console.error("Error generating or saving QR codes:", error);
        res.status(500).json({ message: "Error generating or saving QR codes", error });
    }
};

// Controller to get all QR codes
export const getAllQRCodesFn = async (req, res) => {
    // Fix the authorization check using `&&`
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const qrCodes = await getAllQRCodes();
        // Convert the UTC createDate to local date in the response
        // if this gives wrong date then remove below code and do the date conversion in frontend application
        // Start
        qrCodes.forEach(qrCode => {
        const localDate = new Date(qrCode.createDate);
        qrCode.createDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];  // YYYY-MM-DD in local timezone
        });
        // End
        res.status(200).json(qrCodes);
    } catch (error) {
        console.error("Error getting all QR codes:", error);
        res.status(500).json({ message: "Error getting all QR codes", error });
    }
};

// Controller to update the active status of a QR code
export const updateQRCodeStatusFn = async (req, res) => {
    const { qrCode, active } = req.params;
    
    // Fix the authorization check using `&&`
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        await updateQRCodeStatus(qrCode, active);
        res.status(200).json({ message: "QR Code status updated successfully" });
    } catch (error) {
        console.error("Error updating QR code status:", error);
        res.status(500).json({ message: "Error updating QR code status", error });
    }
};

// Controller to get QR code details by QR code
export const getQRCodeByCodeFn = async (req, res) => {
    const { qrCode } = req.params;
    
    // Fix the authorization check using `&&`
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const qrCodeData = await getQRCodeByCode(qrCode);
        if (!qrCodeData) {
            return res.status(404).json({ message: "QR Code not found" });
        }

        const localDate = new Date(qrCodeData.createDate);
        qrCodeData.createDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];  // YYYY-MM-DD in local timezone

        res.status(200).json(qrCodeData);
    } catch (error) {
        console.error("Error getting QR code by code:", error);
        res.status(500).json({ message: "Error getting QR code by code", error });
    }
};