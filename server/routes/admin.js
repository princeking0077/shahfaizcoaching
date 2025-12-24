const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware to verify Admin
const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'kalam_secret_key_123', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
        req.user = decoded;
        next();
    });
};

router.use(verifyAdmin);

// === TEACHERS ===
router.get('/teachers', (req, res) => {
    try {
        const teachers = db.prepare('SELECT id, name, username, email FROM users WHERE role = ?').all('teacher');
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/teachers', (req, res) => {
    const { name, username, password, email } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 10);
        const result = db.prepare('INSERT INTO users (username, password, role, name, email) VALUES (?, ?, ?, ?, ?)')
            .run(username, hash, 'teacher', name, email);
        res.json({ id: result.lastInsertRowid, message: 'Teacher created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Username likely exists or server error' });
    }
});

// === STUDENTS ===
router.get('/students', (req, res) => {
    try {
        // Join with batches to get batch name
        const students = db.prepare(`
      SELECT s.id, u.name, b.name as batch_name, s.parent_name, s.phone 
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN batches b ON s.batch_id = b.id
    `).all();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === FEES ===
router.get('/fees', (req, res) => {
    const fees = db.prepare(`
    SELECT f.*, u.name as student_name, b.name as batch_name
    FROM fees f
    JOIN students s ON f.student_id = s.id
    JOIN users u ON s.user_id = u.id
    LEFT JOIN batches b ON s.batch_id = b.id
  `).all();
    res.json(fees);
});

// Add Fee Record
router.post('/fees', (req, res) => {
    const { student_id, amount_total, due_date } = req.body;
    const result = db.prepare('INSERT INTO fees (student_id, amount_total, due_date) VALUES (?, ?, ?)')
        .run(student_id, amount_total, due_date);
    res.json({ success: true, id: result.lastInsertRowid });
});

// Update Fee Payment
router.put('/fees/:id', (req, res) => {
    const { amount_paid, status } = req.body;
    db.prepare('UPDATE fees SET amount_paid = ?, status = ? WHERE id = ?')
        .run(amount_paid, status, req.params.id);
    res.json({ success: true });
});

module.exports = router;
