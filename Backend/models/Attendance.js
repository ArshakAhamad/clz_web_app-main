import conn from "../config/db.js";

// Function to create a new attendance
export const createAttendance = async (attendanceData) => {
    const { studentId, studentQRCode, classId, attendanceDate, markedBy } = attendanceData;
    const query = `INSERT INTO attendance ( studentId, studentQRCode, classId, attendanceDate, markedBy ) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await conn.execute(query, [ studentId, studentQRCode, classId, attendanceDate, markedBy ]);
    return result.insertId;
};

// Function to get attendance details by attendance id
export const getAttendanceById = async (attendanceId) => {
    const [rows] = await conn.execute('SELECT * FROM attendance WHERE Id = ?', [attendanceId]);
    return rows[0];
}

// Function to get all attendance details
export const getAllAttendance = async () => {
    const [rows] = await conn.execute('SELECT * FROM attendance');
    return rows;
}

// Function to update the attendance details
export const updateAttendance = async (attendanceData) => {
    const { attendanceId, studentId, studentQRCode, classId, attendanceDate, markedBy } = attendanceData;
    const query = `UPDATE attendance SET studentId = ?, studentQRCode = ?, classId = ?, attendanceDate = ?, markedBy = ? WHERE attendanceId = ?`;
    await conn.execute(query, [ studentId, studentQRCode, classId, attendanceDate, markedBy, attendanceId ]);
};