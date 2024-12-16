import { 
    createStudent, 
    getAllStudents, 
    getStudentById, 
    isStudentEnrolledInClass, 
    getStudentByQRCode, 
    enrollStudentInClass, 
    getStudentIdByPartialName, 
    updateStudentQRCode,  
    updateStudentDetails 
} from "../models/Student.js";
import { body, validationResult } from 'express-validator';
import conn from '../config/db.js';

// Validation rules
export const studentValidation = [
    body('name').isString().withMessage('Invalid name'),
    body('email').isEmail().withMessage('Invalid email'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('addressDistrict').isString().withMessage('Invalid district'),
    body('addressCity').isString().withMessage('Invalid city'),
    body('addressRoad').isString().withMessage('Invalid road'),
    body('registeredDate').isDate().withMessage('Invalid registered date'),
    body('birthDay').isDate().withMessage('Invalid birthday'),
    body('phoneNumber1').isMobilePhone().withMessage('Invalid phone number'),
    body('phoneNumber2').optional({ nullable: true, checkFalsy: true }).isMobilePhone().withMessage('Invalid phone number'),
    body('classId').isInt({ min: 1 }).withMessage('Invalid class ID'),
    body('studentQRCode').isString().withMessage('Invalid QR code'),
    body('freeCard').isInt({ min: 0, max: 1 }).withMessage('Invalid free card status'),
];

// Controller to create or enroll a student with transaction handling
export const createOrEnrollStudentFn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const studentData = req.body;

    // Get a database connection
    const connection = await conn.getConnection();
    await connection.beginTransaction();

    try {
        const existingStudent = await getStudentByQRCode(studentData.studentQRCode);

        // Check if student already exists
        if (existingStudent) {
            // Check if the student is already enrolled in the class
            const isEnrolled = await isStudentEnrolledInClass(existingStudent.studentId, studentData.classId);
            if (isEnrolled) {
                await connection.rollback(); // Rollback if student is already enrolled
                return res.status(400).json({ message: 'Student already enrolled in this class.' });
            } else {
                // Enroll the student in the new class
                await enrollStudentInClass(existingStudent.studentId, studentData.classId, studentData.studentQRCode);
                await connection.commit();
                return res.status(200).json({ message: 'Student enrolled in the new class successfully', studentId: existingStudent.studentId });
            }
        } else {
            // Create a new student if not found
            const newStudentId = await createStudent(studentData);
            await enrollStudentInClass(newStudentId, studentData.classId, studentData.studentQRCode);
            await connection.commit();
            return res.status(201).json({ message: 'Student created and enrolled successfully', studentId: newStudentId });
        }
    } catch (error) {
        await connection.rollback(); // Ensure rollback in case of error
        console.error('Error creating or enrolling student:', error);
        res.status(500).json({ message: 'Error creating or enrolling student', error });
    } finally {
        connection.release(); // Release the connection
    }
};

// Controller to get all students
export const getAllStudentsControllerFn = async (req, res) => {
    try {
        const students = await getAllStudents();
        res.status(200).json({ data: students });
    } catch (error) {
        console.error('Error getting all students:', error);
        res.status(500).json({ message: 'Error getting all students', error });
    }
};

// Controller to get a student by id
export const getStudentByIdControllerFn = async (req, res) => {
    try {
        const studentData = await getStudentById(req.params.studentId);
        if (!studentData) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ data: studentData });
    } catch (error) {
        console.error('Error getting student by id:', error);
        res.status(500).json({ message: 'Error getting student by id', error });
    }
};

// Get student by QR code
export const getStudentByQRCodeControllerFn = async (req, res) => {
    try {
        const studentData = await getStudentByQRCode(req.params.studentQRCode);
        if (!studentData) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ data: studentData });
    } catch (error) {
        console.error('Error getting student by QR code:', error);
        res.status(500).json({ message: 'Error getting student by QR code', error });
    }
};

// Update student QR code by partial name (used when QR code is lost)
export const updateStudentQRCodeByPartialNameFn = async (req, res) => {
    const { partialName, birthDay, phoneNumber1, newQRCode } = req.body;

    try {
        // Fetch student ID based on partial name, birth date, and phone number
        const studentId = await getStudentIdByPartialName(partialName, birthDay, phoneNumber1);

        // Update the student's QR code
        await updateStudentQRCode(studentId, newQRCode);

        // Success response
        res.status(200).json({ message: 'Student QR code updated successfully' });
    } catch (error) {
        console.error('Error updating student QR code:', error);

        // Handle operational errors differently
        if (error.isOperational) {
            return res.status(error.statusCode || 400).json({ message: error.message });
        }

        // For unexpected errors, return a generic message
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update student details by studentId
export const updateStudentDetailsFn = async (req, res) => {
    const studentId = req.params.studentId;
    const updatedStudentData = req.body;
    try {
        await updateStudentDetails(studentId, updatedStudentData);
        res.status(200).json({ message: 'Student details updated successfully' });
    } catch (error) {
        console.error('Error updating student details:', error);
        res.status(500).json({ message: 'Error updating student details', error });
    }
};

// Update student QR code by studentId
export const updateStudentQRCodeFn = async (req, res) => {
    const studentId = req.params.studentId;
    const newQRCode = req.body.studentQRCode;
    try {
        await updateStudentQRCode(studentId, newQRCode);
        res.status(200).json({ message: 'Student QR code updated successfully' });
    } catch (error) {
        console.error('Error updating student QR code:', error);
        res.status(500).json({ message: 'Error updating student QR code', error });
    }
};
