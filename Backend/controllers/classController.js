import { createClass, getAllClasses, getClassById, updateClass, updateClassStatus } from "../models/Class.js";
import { body, validationResult } from 'express-validator';

// Validate the request body
export const classValidation = [
    body('className').isString().withMessage('Invalid class name'),
    body('classDate').isIn(['monday','tuesday','wednesday','thursday','friday','saturday','sunday']).withMessage('Invalid class date'),
    body('classStartDate').isDate().withMessage('Invalid class start date'),
    body('classDescription').isLength({ max: 100 }).isString().withMessage('Invalid class description length(max-100)'),
    body('location').isString().withMessage('Invalid location'),
    body('classYear').isInt({ min: 2000, max: 9999 }).withMessage('Invalid class year'),
    body('type').isString().isIn(['individual','group','hall']).withMessage('Invalid class type'),
    body('classFee').isDecimal().withMessage('Invalid class fee'),
    body('freeCard').isInt({ min: 0, max: 1}).withMessage('Invalid free card'),
    body('registrationFee').isDecimal().withMessage('Invalid registration fee'),
    body('maxStudentCount').isInt({ min: 1 }).withMessage('Invalid max student count'),
    body('accessHaveUsersId').isArray().withMessage('Invalid accessHaveUserId array'),
];

// Controller to create a new class
export const createNewClassFn = async (req, res) => {
    if (![1, 2].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const classData = { ...req.body, createdUserId: req.user.userId };
        
        if (classData.type === 'individual') {
            classData.maxStudentCount = 1;
        }
        const newClass = await createClass(classData);
        res.status(201).json({ message: 'Class created successfully', data: newClass });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Error creating class', error });
    }
};

// Controller to get all classes
export const getAllClassesControllerFn = async (req, res) => {
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const classes = await getAllClasses();
        res.status(200).json({ data: classes });
    } catch (error) {
        console.error('Error getting all classes:', error);
        res.status(500).json({ message: 'Error getting all classes', error });
    }
};

// Controller to get a class by id
export const getClassByIdControllerFn = async (req, res) => {
    if (![1, 2, 3].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const classData = await getClassById(req.params.classId);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json({ data: classData });
    } catch (error) {
        console.error('Error getting class by id:', error);
        res.status(500).json({ message: 'Error getting class by id', error });
    }
};

// Controller to update a class
export const updateClassControllerFn = async (req, res) => {
    if (![1, 2].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { classId } = req.params;
        const classData = { ...req.body, classId: parseInt(classId) };

        await updateClass(classData);
        
        const updatedClass = await getClassById(classId);
        res.status(200).json({ message: 'Class updated successfully', data: updatedClass });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ message: 'Error updating class', error });
    }
};


// Controller to update the active status of a class
export const updateClassStatusControllerFn = async (req, res) => {
    if (![1, 2].includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        await updateClassStatus(req.params.classId, req.params.active);
        res.status(200).json({ message: 'Class status updated successfully' });
    } catch (error) {
        console.error('Error updating class status:', error);
        res.status(500).json({ message: 'Error updating class status', error });
    }
};
