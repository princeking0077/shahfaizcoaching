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

router.get('/profile', (req, res) => {
    const student = db.prepare(`
    SELECT s.*, u.name, u.email, b.name as batch_name 
    FROM students s 
    JOIN users u ON s.user_id = u.id 
    LEFT JOIN batches b ON s.batch_id = b.id
    WHERE s.user_id = ?
  `).get(req.user.id); // user_id in token is from users table. student table has user_id FK.

    // Wait, req.user.id is from users table. 
    // We need to find student record where user_id = req.user.id
    // The query above does that.

    // Actually, wait. req.user.id is the ID from users table.
    // The query `WHERE s.user_id = ?` is correct.

    if (student) res.json(student);
    else res.status(404).json({ error: 'Student profile not found' });
});

router.get('/attendance', (req, res) => {
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const attendance = db.prepare('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC').all(student.id);
    res.json(attendance);
});

router.get('/fees', (req, res) => {
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const fees = db.prepare('SELECT * FROM fees WHERE student_id = ?').all(student.id);
    res.json(fees);
});

module.exports = router;
