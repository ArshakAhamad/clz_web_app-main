// If the class ever needs to do the student registration to a class through a QR code link
// this is the place to do it.
/*
// Update the function to generate and save QR code in models/Class.js
import QRCode from 'qrcode';

export const generateClassQRCode = async (classData) => {
    const BASE_URL = process.env.BASE_URL_FRONTEND || process.env.DEV_BASE_URL_FRONTEND;
    const classURL = `${BASE_URL}/register?classId=${classData.classId}`;
    const qrCodeData = await QRCode.toDataURL(classURL);
    await conn.execute('UPDATE class SET qrCode = ? WHERE classId = ?', [qrCodeData, classData.classId]);
    return qrCodeData;
};
*/