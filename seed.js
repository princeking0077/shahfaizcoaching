const bcrypt = require('bcryptjs');

async function seedData(pool) {
    const logs = [];
    const log = (msg) => { console.log(msg); logs.push(msg); };

    log('🚀 Starting Seeder...');
    let conn;
    try {
        log('🔌 Attempting DB Connection...');
        conn = await pool.getConnection();
        log('✅ DB Connected.');

        // 1. Seed Admin
        log('🔍 Checking Admin User...');
        const [admins] = await conn.query('SELECT * FROM users WHERE role = ?', ['admin']);
        if (admins.length === 0) {
            log('🔨 Creating Admin User...');
            const hash = bcrypt.hashSync('admin123', 10);
            await conn.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
                ['admin', hash, 'admin', 'Super Admin']);
            log('✅ Admin Created');
        } else {
            log('ℹ️ Admin already exists.');
        }

        // 2. Seed Teacher
        log('🔍 Checking Teacher User...');
        const [teachers] = await conn.query('SELECT * FROM users WHERE role = ?', ['teacher']);
        if (teachers.length === 0) {
            log('🔨 Creating Teacher User...');
            const hash = bcrypt.hashSync('teacher123', 10);
            await conn.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
                ['teacher', hash, 'teacher', 'Rahul Sir']);
            log('✅ Teacher Created');
        } else {
            log('ℹ️ Teacher already exists.');
        }

        // Get Teacher ID
        const [teacherRows] = await conn.query('SELECT id FROM users WHERE role = ? LIMIT 1', ['teacher']);
        const teacherId = teacherRows[0].id;

        // 3. Seed Batch
        log('🔍 Checking Batches...');
        const [batches] = await conn.query('SELECT * FROM batches');
        let batchId;
        if (batches.length === 0) {
            log('🔨 Creating Batch...');
            const [res] = await conn.query('INSERT INTO batches (name, timing, subject, teacher_id) VALUES (?, ?, ?, ?)',
                ['Class 10 - Math', '10:00 AM', 'Mathematics', teacherId]);
            batchId = res.insertId;
            log('✅ Batch Created');
        } else {
            batchId = batches[0].id;
            log('ℹ️ Batch already exists.');
        }

        // 4. Seed Student
        log('🔍 Checking Students...');
        const [students] = await conn.query('SELECT * FROM users WHERE role = ?', ['student']);
        if (students.length === 0) {
            log('🔨 Creating Student...');
            const hash = bcrypt.hashSync('student123', 10);
            const [userRes] = await conn.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
                ['student', hash, 'student', 'Arjun Kumar']);

            await conn.query('INSERT INTO students (user_id, batch_id, parent_name, phone) VALUES (?, ?, ?, ?)',
                [userRes.insertId, batchId, 'Mr. Kumar', '9876543210']);
            log('✅ Student Created');
        } else {
            log('ℹ️ Student already exists.');
        }

        return { success: true, logs };

    } catch (e) {
        log('❌ ERROR: ' + e.message);
        throw { message: e.message, logs };
    } finally {
        if (conn) conn.release();
    }
}

module.exports = seedData;
