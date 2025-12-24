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
router.get('/teachers', async (req, res) => {
    try {
        const [teachers] = await db.query('SELECT id, name, username, email FROM users WHERE role = ?', ['teacher']);
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/teachers', async (req, res) => {
    const { name, username, password, email } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 10);
        const [result] = await db.query('INSERT INTO users (username, password, role, name, email) VALUES (?, ?, ?, ?, ?)',
            [username, hash, 'teacher', name, email]);
        res.json({ id: result.insertId, message: 'Teacher created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Username likely exists or server error: ' + err.message });
    }
});

// === STUDENTS ===
router.get('/students', async (req, res) => {
    try {
        const [students] = await db.query(`
            SELECT s.id, u.name, b.name as batch_name, s.parent_name, s.phone 
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN batches b ON s.batch_id = b.id
        `);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === FEES ===
router.get('/fees', async (req, res) => {
    try {
        const [fees] = await db.query(`
            SELECT f.*, u.name as student_name, b.name as batch_name
            FROM fees f
            JOIN students s ON f.student_id = s.id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN batches b ON s.batch_id = b.id
        `);
        res.json(fees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Fee Record
router.post('/fees', async (req, res) => {
    const { student_id, amount_total, due_date } = req.body;
    try {
        const [result] = await db.query('INSERT INTO fees (student_id, amount_total, due_date) VALUES (?, ?, ?)',
            [student_id, amount_total, due_date]);
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Fee Payment
router.put('/fees/:id', async (req, res) => {
    const { amount_paid, status } = req.body;
    try {
        await db.query('UPDATE fees SET amount_paid = ?, status = ? WHERE id = ?',
            [amount_paid, status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
