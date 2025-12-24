const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

// Middleware
const verifyStudent = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token' });

    jwt.verify(token, process.env.JWT_SECRET || 'kalam_secret_key_123', (err, decoded) => {
        if (err || decoded.role !== 'student') return res.status(403).json({ error: 'Student access required' });
        req.user = decoded;
        next();
    });
};

router.use(verifyStudent);

router.get('/profile', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, u.name, u.email, b.name as batch_name 
            FROM students s 
            JOIN users u ON s.user_id = u.id 
            LEFT JOIN batches b ON s.batch_id = b.id
            WHERE s.user_id = ?
        `, [req.user.id]);

        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: 'Student profile not found' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/attendance', async (req, res) => {
    try {
        const [studentRows] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (studentRows.length === 0) return res.status(404).json({ error: 'Student not found' });

        const [attendance] = await db.query('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC', [studentRows[0].id]);
        res.json(attendance);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/fees', async (req, res) => {
    try {
        const [studentRows] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (studentRows.length === 0) return res.status(404).json({ error: 'Student not found' });

        const [fees] = await db.query('SELECT * FROM fees WHERE student_id = ?', [studentRows[0].id]);
        res.json(fees);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
