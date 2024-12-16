// server.js 
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoute.js';
import qrRoutes from './routes/qrRoute.js';
import classRoutes from './routes/classRoute.js';
import studentRoutes from './routes/studentRoute.js';
import userRoutes from './routes/userRoute.js';
import attendanceRoutes from './routes/attendanceRoute.js';
import paymentRoutes from './routes/paymentRoute.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Define the allowed origins
const allowedOrigins = [
    'https://savour-admin.netlify.app',   // Host Admin frontend
    'http://localhost:5173',              // Development Local Admin frontend
    /*
    process.env.FRONTEND_ADMIN || 'http://localhost:3000',
    */
];
  
// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies or authorization headers
};

// Apply CORS middleware to Express
app.use(cors(corsOptions));

const io = new Server(server, {
    cors: { origin: '*' },
    allowEIO3: true,
    credentials: true,
});

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/qr-codes', qrRoutes);
app.use('/api/class', classRoutes);
app.use('/api/student', studentRoutes); // Handles student-related routes
app.use('/api/user', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);

/* WebSocket Implementation (Unused, but retained for reference)
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`WebSocket connected: ${socket.id}, User: ${socket.userId}`);

    socket.on('attendance-marked', (data) => {
        console.log('Attendance marked:', data);
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });
});
*/
const activeUsers = {};  // Object to store active sessions

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;

        // Check if user already has an active session
        if (activeUsers[socket.userId]) {
            // Disconnect the previous session
            activeUsers[socket.userId].disconnect();
        }

        // Set the new active socket for the user
        activeUsers[socket.userId] = socket;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`WebSocket connected: ${socket.id}, User: ${socket.userId}`);

    socket.on('attendance-marked', (data) => {
        console.log('Attendance marked:', data);
    });

    socket.on('disconnect', () => {
        console.log(`WebSocket disconnected: ${socket.id}`);

        // Remove user from active session tracker if they disconnect
        if (activeUsers[socket.userId] === socket) {
            delete activeUsers[socket.userId];
        }
    });
});

export { io };

// Start the server
server.listen(process.env.PORT, () => {
    console.log('Server running on port:', process.env.PORT);
});
