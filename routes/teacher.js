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
router.get('/batches', (req, res) => {
    const batches = db.prepare('SELECT * FROM batches WHERE teacher_id = ?').all(req.user.id);
    res.json(batches);
});

router.post('/batches', (req, res) => {
    const { name, timing, subject } = req.body;
    const result = db.prepare('INSERT INTO batches (name, timing, subject, teacher_id) VALUES (?, ?, ?, ?)')
        .run(name, timing, subject, req.user.id);
    res.json({ id: result.lastInsertRowid, success: true });
});

// Students
router.get('/batches/:batchId/students', (req, res) => {
    const students = db.prepare('SELECT s.*, u.name, u.email FROM students s JOIN users u ON s.user_id = u.id WHERE s.batch_id = ?').all(req.params.batchId);
    res.json(students);
});

// Add Student (Creates user student account + entry in students table)
router.post('/batches/:batchId/students', (req, res) => {
    const { name, parent_name, phone } = req.body;
    const batchId = req.params.batchId;
    const username = name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 1000);
    const password = 'password'; // Default password

    try {
        const createUser = db.prepare('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)').run(username, '$2a$10$X.x.x', 'student', name); // TODO hash pwd
        // Using a simple hash for 'password' to speed up dev or install bcrypt
        const hash = require('bcryptjs').hashSync(password, 10);
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, createUser.lastInsertRowid);

        db.prepare('INSERT INTO students (user_id, batch_id, parent_name, phone) VALUES (?, ?, ?, ?)')
            .run(createUser.lastInsertRowid, batchId, parent_name, phone);

        res.json({ success: true, username, password });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Attendance
router.post('/attendance', (req, res) => {
    const { batchId, date, students } = req.body; // students: [{id, status}]
    try {
        // Basic implementation: Bulk insert or loop
        const stmt = db.prepare('INSERT INTO attendance (student_id, batch_id, date, status) VALUES (?, ?, ?, ?)');
        const insertMany = db.transaction((attendanceList) => {
            for (const record of attendanceList) {
                stmt.run(record.id, batchId, date, record.status); // record.id is student.id (from students table)
            }
        });
        insertMany(students);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Marks
router.post('/marks', (req, res) => {
    const { batchId, exam_name, subject, marksList } = req.body; // marksList: [{student_id, marks_obtained, total_marks}]

    try {
        const stmt = db.prepare('INSERT INTO marks (student_id, batch_id, exam_name, subject, marks_obtained, total_marks) VALUES (?, ?, ?, ?, ?, ?)');
        const insertMany = db.transaction((list) => {
            for (const m of list) {
                stmt.run(m.student_id, batchId, exam_name, subject, m.marks_obtained, m.total_marks);
            }
        });
        insertMany(marksList);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
