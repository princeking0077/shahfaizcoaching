const http = require('http');

async function startApp() {
    try {
        const express = require('express');
        const cors = require('cors');
        const path = require('path');
        const fs = require('fs');

        // ------------- CHECK MODULES & ENV ----------------
        const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
        const missingEnv = requiredEnv.filter(key => !process.env[key]);
        if (missingEnv.length > 0) console.warn('⚠️ MISSING ENV:', missingEnv.join(', '));

        const db = require('./database');
        // --------------------------------------------------

        const app = express();
        const PORT = process.env.PORT || 5000;

        app.use(cors());
        app.use(express.json());

        // Import Routes safely
        app.use('/api/auth', require('./routes/auth'));
        app.use('/api/admin', require('./routes/admin'));
        app.use('/api/teacher', require('./routes/teacher'));
        app.use('/api/student', require('./routes/student'));

        // DB Init - Non-blocking
        db.initDb().catch(e => console.error('DB Init Error:', e));

        // Serve Frontend
        const clientBuildPath = path.join(__dirname, 'client/dist');
        if (fs.existsSync(clientBuildPath)) {
            app.use(express.static(clientBuildPath));
        }

        // Status Route
        app.get('/api/status', async (req, res) => {
            try {
                const conn = await db.getConnection();
                await conn.query('SELECT 1');
                conn.release();
                res.json({ status: 'ok', db: 'connected' });
            } catch (e) {
                res.status(500).json({ status: 'error', error: e.message });
            }
        });

        // Seeding Route (Manual Fix)
        app.get('/api/seed', async (req, res) => {
            try {
                const seedData = require('./seed');
                const result = await seedData(db);
                res.json({ status: 'success', logs: result.logs });
            } catch (e) {
                // If seed.js threw an object with logs, use that.
                res.status(500).json({
                    status: 'error',
                    error: e.message || e.toString(),
                    config_check: {
                        DB_HOST: process.env.DB_HOST ? '✅ Set: ' + process.env.DB_HOST : '❌ MISSING (Default: localhost)',
                        DB_USER: process.env.DB_USER ? '✅ Set: ' + process.env.DB_USER : '❌ MISSING (Default: root)',
                        DB_PASS: process.env.DB_PASSWORD ? '✅ Set (Hidden)' : '❌ MISSING (Default: empty)',
                        DB_NAME: process.env.DB_NAME ? '✅ Set: ' + process.env.DB_NAME : '❌ MISSING (Default: kalam)'
                    },
                    logs: e.logs || ['Script failed before logging started']
                });
            }
        });

        // Catch-all (Regex for Express 5 compatibility)
        app.get(/.*/, (req, res) => {
            const index = path.join(__dirname, 'client/dist/index.html');
            if (fs.existsSync(index)) res.sendFile(index);
            else res.send(`<h1>Backend Running (Safe Mode v4)</h1><p>Frontend not found.</p>`);
        });

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (err) {
        // ----------------------------------------------------------------
        // FALLBACK SERVER: If ANYTHING crashes, we start this minimal server
        // so we can see the error in the browser.
        // ----------------------------------------------------------------
        console.error('CRITICAL CRASH:', err);
        const PORT = process.env.PORT || 5000;
        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <h1 style="color:red">Server Crashed at Startup 🚨</h1>
                <pre style="background:#eee; padding:10px; border:1px solid #999;">${err.stack}</pre>
                <p>Please fix the error shown above.</p>
            `);
        });
        server.listen(PORT, () => console.log('Fallback server running on ' + PORT));
    }
}

startApp();
