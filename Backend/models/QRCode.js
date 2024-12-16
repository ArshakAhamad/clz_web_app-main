import conn from '../config/db.js';

// Function to save QR code details in the database
export const saveQRCode = async (qrData) => {
    const { qrCode, qrQuantity, createDate, createdByUserId, createdByUsername, type } = qrData;
    const query = `INSERT INTO qr_codes (qrCode, qrQuantity, createDate, createdByUserId, createdByUsername, type) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await conn.execute(query, [qrCode, qrQuantity, createDate, createdByUserId, createdByUsername, type]);
    return result.insertId;
};

// Function to get QR code details by QR code
export const getQRCodeByCode = async (qrCode) => {
    const [rows] = await conn.execute('SELECT * FROM qr_codes WHERE qrCode = ?', [qrCode]);
    return rows[0];
}

// Function to get all QR code details
export const getAllQRCodes = async () => {
    const [rows] = await conn.execute('SELECT * FROM qr_codes');
    return rows;
}

// Function to update the active status of a QR code
export const updateQRCodeStatus = async (qrCode, active) => {
    await conn.execute('UPDATE qr_codes SET active = ? WHERE qrCode = ?', [active, qrCode]);
}