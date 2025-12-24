const express = require('express');
const cors = require('cors');
const path = require('path');
// require('./database'); // Init DB temporarily disabled for debugging

const app = express();
const PORT = process.env.PORT || 5000;

// const authRoutes = require('./routes/auth'); // Disabled for debug

app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/teacher', require('./routes/teacher'));
// app.use('/api/student', require('./routes/student'));

// Serve static files from the React client
app.use(express.static(path.join(__dirname, 'client/dist')));

// API Routes
app.get('/api', (req, res) => {
    res.send('Kalam Coaching API Running');
});

// For any request that doesn't match an API route, send back the React index.html
app.get('*', (req, res) => {
    const fs = require('fs');
    const indexPath = path.join(__dirname, 'client/dist/index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send(`
            <h1>Backend is Running! 🚀</h1>
            <p>However, the React frontend build (client/dist) is missing.</p>
            <p>Ensure that 'npm run build' completed successfully on the server.</p>
            <p>Also, make sure you have added the Environment Variables (DB_USER, etc.) in Hostinger.</p>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
