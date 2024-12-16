import conn from "../config/db.js";

// Function to create a new class
export const createClass = async (classData) => {
    const { className, classDate, classStartDate, classDescription, location, classYear, type, classFee, freeCard, registrationFee, maxStudentCount, accessHaveUsersId, createdUserId } = classData;
    const query = `INSERT INTO class ( className, classDate, classStartDate, classDescription, location, classYear, type, classFee, freeCard, registrationFee, maxStudentCount, accessHaveUsersId, createdUserId ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await conn.execute(query, [ className, classDate, classStartDate, classDescription, location, classYear, type, classFee, freeCard, registrationFee, maxStudentCount, accessHaveUsersId, createdUserId]);
    const classId = result.insertId;
    await updateAccessUserClassMappings(classId, accessHaveUsersId);
    return classId;
};

// Function to get class details by class id
export const getClassById = async (classId) => {
    const [rows] = await conn.execute('SELECT * FROM class WHERE classId = ?', [classId]);
    return rows[0];
}

// Function to get all class details
export const getAllClasses = async () => {
    const [rows] = await conn.execute('SELECT * FROM class');
    return rows;
}

// Function to update the active status of a class
export const updateClassStatus = async (classId, active) => {
    await conn.execute('UPDATE class SET active = ? WHERE classId = ?', [active, classId]);
}

// Function to update the class details
export const updateClass = async (classData) => {
    const { classId, className, classDate, classStartDate, classDescription, location, classYear, type, classFee, freeCard, registrationFee, maxStudentCount, accessHaveUsersId, active } = classData;
    const query = `UPDATE class SET className = ?, classDate = ?, classStartDate = ?, classDescription = ?, location = ?, classYear = ?, type = ?, classFee = ?, freeCard = ?, registrationFee = ?, maxStudentCount = ?, accessHaveUsersId = ?, active = ? WHERE classId = ?`;
    await conn.execute(query, [ className, classDate, classStartDate, classDescription, location, classYear, type, classFee, freeCard, registrationFee, maxStudentCount, accessHaveUsersId, active, classId ]);
    await updateAccessUserClassMappings(classId, accessHaveUsersId);
};

// Function to update user_class with userId and classId
const updateAccessUserClassMappings = async (classId, accessHaveUsersId) => {
    await conn.execute(`DELETE FROM user_class WHERE classId = ?`, [classId]);
    
    const insertQuery = `INSERT INTO user_class (classId, userId) VALUES (?, ?)`;
    const accessUserPromises = accessHaveUsersId.map(userId => conn.execute(insertQuery, [classId, userId]));
    
    await Promise.all(accessUserPromises);
};