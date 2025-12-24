const express = require('express');
const cors = require('cors');
const path = require('path');
// require('./database'); // Init DB temporarily disabled

const app = express();
const PORT = process.env.PORT || 5000;

// const authRoutes = require('./routes/auth'); // Disabled

app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/teacher', require('./routes/teacher'));
// app.use('/api/student', require('./routes/student'));

// Serve static files from the React client
// Check if client/dist exists to avoid crash
const fs = require('fs');
const clientBuildPath = path.join(__dirname, 'client/dist');

if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
} else {
    console.log('Client build not found at ' + clientBuildPath);
}

// API Routes
app.get('/api', (req, res) => {
    res.send('Kalam Coaching API Running (Express is working!)');
});

// For any request that doesn't match an API route
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'client/dist/index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send(`
            <h1>Express Server is Running! 🚀</h1>
            <p>Middleware and Routing are working.</p>
            <p>Database is currently: <strong>DISABLED</strong> for diagnostics.</p>
            <p>Frontend Build Status: ${fs.existsSync(clientBuildPath) ? '✅ Found' : '❌ Not Found (Run npm run build)'}</p>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
