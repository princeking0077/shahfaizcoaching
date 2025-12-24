const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

// Middleware
const verifyTeacher = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token' });

    jwt.verify(token, process.env.JWT_SECRET || 'kalam_secret_key_123', (err, decoded) => {
        if (err || decoded.role !== 'teacher') return res.status(403).json({ error: 'Teacher access required' });
        req.user = decoded;
        next();
    });
};

router.use(verifyTeacher);

// Batches
router.get('/batches', async (req, res) => {
    try {
        const [batches] = await db.query('SELECT * FROM batches WHERE teacher_id = ?', [req.user.id]);
        res.json(batches);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/batches', async (req, res) => {
    const { name, timing, subject } = req.body;
    try {
        const [result] = await db.query('INSERT INTO batches (name, timing, subject, teacher_id) VALUES (?, ?, ?, ?)',
            [name, timing, subject, req.user.id]);
        res.json({ id: result.insertId, success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Students
router.get('/batches/:batchId/students', async (req, res) => {
    try {
        const [students] = await db.query('SELECT s.*, u.name, u.email FROM students s JOIN users u ON s.user_id = u.id WHERE s.batch_id = ?', [req.params.batchId]);
        res.json(students);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Add Student
router.post('/batches/:batchId/students', async (req, res) => {
    const { name, parent_name, phone } = req.body;
    const batchId = req.params.batchId;
    const username = name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 1000);
    const password = 'password';

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const hash = require('bcryptjs').hashSync(password, 10);
        const [userRes] = await connection.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
            [username, hash, 'student', name]);

        await connection.query('INSERT INTO students (user_id, batch_id, parent_name, phone) VALUES (?, ?, ?, ?)',
            [userRes.insertId, batchId, parent_name, phone]);

        await connection.commit();
        res.json({ success: true, username, password });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

// Attendance
router.post('/attendance', async (req, res) => {
    const { batchId, date, students } = req.body; // students: [{id, status}]
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        for (const record of students) {
            await connection.query('INSERT INTO attendance (student_id, batch_id, date, status) VALUES (?, ?, ?, ?)',
                [record.id, batchId, date, record.status]);
        }
        await connection.commit();
        res.json({ success: true });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

// Marks
router.post('/marks', async (req, res) => {
    const { batchId, exam_name, subject, marksList } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        for (const m of marksList) {
            await connection.query('INSERT INTO marks (student_id, batch_id, exam_name, subject, marks_obtained, total_marks) VALUES (?, ?, ?, ?, ?, ?)',
                [m.student_id, batchId, exam_name, subject, m.marks_obtained, m.total_marks]);
        }
        await connection.commit();
        res.json({ success: true });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
