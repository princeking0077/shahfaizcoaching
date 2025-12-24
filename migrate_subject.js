const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'kalam.db'), { verbose: console.log });

try {
    console.log('Migrating Batches Table...');
    db.prepare('ALTER TABLE batches ADD COLUMN subject TEXT').run();
    console.log('✅ Added subject column to batches table');
} catch (e) {
    if (e.message.includes('duplicate column name')) {
        console.log('⚠️ Column already exists, skipping.');
    } else {
        console.error('❌ Migration Failed:', e.message);
    }
}
