const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create connection pool
// Create connection pool
const pool = mysql.createPool({
  host: '127.0.0.1', // Force IPv4 to avoid ::1 permission issues
  user: 'u480091743_faiz',
  password: 'Sk@001001',
  database: 'u480091743_kalam',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Helper for 'prepare().run()' style from SQLite, adapted for MySQL
// This allows us to keep some semantic similarity, although we will need to refactor routes.
// Actually, we'll export the promisePool for direct usage in routes.

async function initDb() {
  try {
    const connection = await promisePool.getConnection();

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'teacher', 'student') NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Batches Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        timing VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        teacher_id INT NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Students Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        batch_id INT,
        parent_name VARCHAR(255),
        phone VARCHAR(20),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL
      )
    `);

    // Attendance Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        batch_id INT NOT NULL,
        date DATE NOT NULL, 
        status ENUM('present', 'absent') NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
      )
    `);

    // Marks Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        batch_id INT NOT NULL,
        exam_name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        marks_obtained DECIMAL(5,2) NOT NULL,
        total_marks DECIMAL(5,2) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
      )
    `);

    // Fees Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        amount_total DECIMAL(10,2) NOT NULL,
        amount_paid DECIMAL(10,2) DEFAULT 0,
        status ENUM('paid', 'pending', 'partial') DEFAULT 'pending',
        due_date DATE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ MySQL Database initialized tables.');
    connection.release();

    seedAdmin();
  } catch (err) {
    console.error('❌ Database Initialization Error:', err);
  }
}

async function seedAdmin() {
  try {
    const [rows] = await promisePool.query('SELECT * FROM users WHERE role = ?', ['admin']);
    if (rows.length === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await promisePool.query('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
        ['admin', hash, 'admin', 'Super Admin']);
      console.log('✅ Admin seeded: admin / admin123');
    }
  } catch (e) {
    console.error('❌ Seeding Error:', e);
  }
}

// initDb(); // <--- REMOVED AUTO-EXECUTION to prevent crash

promisePool.initDb = initDb; // Attach to export
module.exports = promisePool;
