const bcrypt = require('bcryptjs');

async function seedData(pool) {
    const conn = await pool.getConnection();
    try {
        console.log('🌱 Starting Seed...');

        // 1. Seed Admin
        const [admins] = await conn.query('SELECT * FROM users WHERE role = ?', ['admin']);
        if (admins.length === 0) {
            const hash = bcrypt.hashSync('admin123', 10);
            await conn.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
                ['admin', hash, 'admin', 'Super Admin']);
            console.log('✅ Admin Created');
        }

        // 2. Seed Teacher
        const [teachers] = await conn.query('SELECT * FROM users WHERE role = ?', ['teacher']);
        if (teachers.length === 0) {
            const hash = bcrypt.hashSync('teacher123', 10);
            await conn.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
                ['teacher', hash, 'teacher', 'Rahul Sir']);
            console.log('✅ Teacher Created');
        }

        // Get Teacher ID
        const [teacherRows] = await conn.query('SELECT id FROM users WHERE role = ? LIMIT 1', ['teacher']);
        const teacherId = teacherRows[0].id;

        // 3. Seed Batch
        const [batches] = await conn.query('SELECT * FROM batches');
        let batchId;
        if (batches.length === 0) {
            const [res] = await conn.query('INSERT INTO batches (name, timing, subject, teacher_id) VALUES (?, ?, ?, ?)',
                ['Class 10 - Math', '10:00 AM', 'Mathematics', teacherId]);
            batchId = res.insertId;
            console.log('✅ Batch Created');
        } else {
            batchId = batches[0].id;
        }

        // 4. Seed Student
        const [students] = await conn.query('SELECT * FROM users WHERE role = ?', ['student']);
        if (students.length === 0) {
            // Create User entry first
            const hash = bcrypt.hashSync('student123', 10);
            const [userRes] = await conn.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
                ['student', hash, 'student', 'Arjun Kumar']);

            // Create Student Profile
            await conn.query('INSERT INTO students (user_id, batch_id, parent_name, phone) VALUES (?, ?, ?, ?)',
                [userRes.insertId, batchId, 'Mr. Kumar', '9876543210']);
            console.log('✅ Student Created');
        }

        return { success: true, message: 'Database seeded successfully' };

    } catch (e) {
        console.error('Seeding Error:', e);
        throw e;
    } finally {
        conn.release();
    }
}

module.exports = seedData;
