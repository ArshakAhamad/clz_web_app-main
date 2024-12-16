import { createAttendance, getAllAttendance, getAttendanceById, updateAttendance } from "../models/Attendance.js";
import { body, validationResult } from 'express-validator';

// Validate the request body
export const attendanceValidation = [
    body('studentId').isInt().withMessage('Invalid studentId'),
    body('studentQRCode').isString().withMessage('Invalid studentQRCode'),
    body('classId').isInt().withMessage('Invalid classId'),
    body('attendanceDate').isDate().withMessage('Invalid attendanceDate'),
    body('markedBy').isInt().withMessage('Invalid markedBy'),
];

// Controller to create a new attendance
export const createNewAttendanceFn = async (req, res) => {
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const attendanceData = { ...req.body, markedBy: req.user.userId };
        const newAttendance = await createAttendance(attendanceData);
        res.status(201).json({ message: 'Attendance created successfully', data: newAttendance });
    } catch (error) {
        console.error('Error creating attendance:', error);
        res.status(500).json({ message: 'Error creating attendance', error });
    }
};

// Controller to get all attendance
export const getAllAttendanceControllerFn = async (req, res) => {
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const attendance = await getAllAttendance();
        res.status(200).json({ data: attendance });
    } catch (error) {
        console.error('Error getting all attendance:', error);
        res.status(500).json({ message: 'Error getting all attendance', error });
    }
};

// Controller to get attendance by id
export const getAttendanceByIdControllerFn = async (req, res) => {
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const attendanceData = await getAttendanceById(req.params.attendanceId);
        if (!attendanceData) {
            return res.status(404).json({ message: 'Attendance not found' });
        }
        res.status(200).json({ data: attendanceData });
    } catch (error) {
        console.error('Error getting attendance by id:', error);
        res.status(500).json({ message: 'Error getting attendance by id', error });
    }
};

// Controller to update attendance
export const updateAttendanceFn = async (req, res) => {
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const attendanceData = { ...req.body, markedBy: req.user.userId };
        await updateAttendance(attendanceData);
        res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ message: 'Error updating attendance', error });
    }
};