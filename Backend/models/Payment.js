import conn from "../config/db.js";

// Function to create a new Payment
export const createPayment = async (paymentData) => {
    if (!paymentData) {
        throw new Error("Payment data is required");
    }
    const { studentId, classId, studentQRCode, paymentType, amount, paymentDate, paymentMonth, createdBy } = paymentData;
    const query = `INSERT INTO payments (studentId, classId, studentQRCode, paymentType, amount, paymentDate, paymentMonth, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await conn.execute(query, [ studentId, classId, studentQRCode, paymentType, amount, paymentDate, paymentMonth, createdBy]);
    return result.insertId;
};

// Function to get payment details by payment id
export const getPaymentById = async (paymentId) => {
    const [rows] = await conn.execute('SELECT * FROM payments WHERE paymentId = ?', [paymentId]);
    return rows[0];
}

// Function to get all payment details
export const getAllPayments = async () => {
    const [rows] = await conn.execute('SELECT * FROM payments');
    return rows;
}

// Function to update the payment details
export const updatePayment = async (paymentData) => {
    const { paymentId, studentId, classId, studentQRCode, paymentType, amount, paymentDate, paymentMonth, createdBy } = paymentData;
    const query = `UPDATE payments SET studentId = ?, classId = ?, studentQRCode = ?, paymentType = ?, amount = ?, paymentDate = ?, paymentMonth = ?, createdBy = ? WHERE paymentId = ?`;
    await conn.execute(query, [ studentId, classId, studentQRCode, paymentType, amount, paymentDate, paymentMonth, createdBy, paymentId ]);
};

// Function to get payement details by studentId and sort them by paymentDate in descending order
export const getPaymentsByStudentId = async (studentId) => {
    const [rows] = await conn.execute('SELECT * FROM payments WHERE studentId = ? ORDER BY paymentDate DESC', [studentId]);
    return rows;
}
