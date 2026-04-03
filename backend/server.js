require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // For development, allow all
        methods: ['GET', 'POST']
    }
});

app.set('io', io); // Allow routes to access io instance

io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
