const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database'); // Safe import (no auto-execution)

const app = express();
const PORT = process.env.PORT || 5000;

// Env Check
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.warn('⚠️ MISSING ENV VARS:', missingEnv.join(', '));
} else {
    console.log('✅ All Env Vars present.');
}

const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

// Safe Database Initialization
db.initDb()
    .then(() => console.log('✅ Database connected and initialized'))
    .catch(err => {
        console.error('❌ Database Initialization Failed (Non-Fatal):', err);
    });

// Serve static files from the React client
const fs = require('fs');
const clientBuildPath = path.join(__dirname, 'client/dist');

if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
} else {
    console.log('Client build not found at ' + clientBuildPath);
}

// API Routes
app.get('/api', (req, res) => {
    res.send('Kalam Coaching API Running');
});

app.get('/api/status', async (req, res) => {
    try {
        const connection = await db.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        res.json({ status: 'ok', database: 'connected' });
    } catch (e) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: e.message });
    }
});

// For any request that doesn't match an API route
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'client/dist/index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send(`
            <h1>Backend is Running! 🚀 (Safe Mode v3)</h1>
            <p><strong>Database Status:</strong> Check Server Logs (console) for "Connection Failed" or "Success".</p>
            <p><strong>Frontend Build Status:</strong> ${fs.existsSync(clientBuildPath) ? '✅ Found' : '❌ Not Found'}</p>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
