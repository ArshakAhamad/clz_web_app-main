// database connection and configuration
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDB = async () => {
    try {
        const connection = await conn.getConnection();
        console.log('MySQL Database connected');
        connection.release();
    } catch (err) {
        console.error('Failed to connect to database', err);
    }
};
export default conn;
