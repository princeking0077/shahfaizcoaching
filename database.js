const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'kalam.db'), { verbose: console.log });

// Initialize Database
function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'teacher', 'student')) NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      timing TEXT NOT NULL,
      subject TEXT, -- Added subject column
      teacher_id INTEGER NOT NULL,
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      batch_id INTEGER,
      parent_name TEXT,
      phone TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (batch_id) REFERENCES batches(id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      batch_id INTEGER NOT NULL,
      date TEXT NOT NULL, 
      status TEXT CHECK(status IN ('present', 'absent')) NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (batch_id) REFERENCES batches(id)
    );

    CREATE TABLE IF NOT EXISTS marks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      batch_id INTEGER NOT NULL,
      exam_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      marks_obtained REAL NOT NULL,
      total_marks REAL NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (batch_id) REFERENCES batches(id)
    );

    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      amount_total REAL NOT NULL,
      amount_paid REAL DEFAULT 0,
      status TEXT CHECK(status IN ('paid', 'pending', 'partial')) DEFAULT 'pending',
      due_date TEXT,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `;
  db.exec(schema);
  console.log('Database initialized.');
}

// Seed Admin Helper
function seedAdmin() {
  const adminCheck = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
  if (!adminCheck) {
    const hash = bcrypt.hashSync('admin123', 10);
    const stmt = db.prepare('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)');
    stmt.run('admin', hash, 'admin', 'Super Admin');
    console.log('Admin seeded: admin / admin123');
  }
}

initDb();
seedAdmin();

module.exports = db;
