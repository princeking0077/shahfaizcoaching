const express = require('express');
const cors = require('cors');
const path = require('path');
require('./database'); // Init DB

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));
// app.use('/api/stats', require('./routes/stats'));

// Serve static files from the React client
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.get('/api', (req, res) => {
    res.send('Kalam Coaching API Running');
});

// For any request that doesn't match an API route, send back the React index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
