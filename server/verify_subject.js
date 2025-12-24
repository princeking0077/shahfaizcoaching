const BASE_URL = 'http://localhost:5000/api';

async function verifySubject() {
    try {
        console.log('🚀 Starting Subject Verification...');

        // 1. Login as Teacher
        console.log('[1] Logging in as Teacher...');
        // We need a teacher account. We'll use one created in previous tests or create a new one via Admin.
        // For speed, let's just create a new teacher via admin.

        // Admin Login
        const adminRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const { token: adminToken } = await adminRes.json();

        // Create Teacher
        const teacherName = `SubjectTeacher_${Date.now()}`;
        const createTeacherRes = await fetch(`${BASE_URL}/admin/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify({ name: teacherName, username: teacherName, password: 'password', email: 'sub@test.com' })
        });
        const teacherData = await createTeacherRes.json();

        // Teacher Login
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: teacherName, password: 'password' })
        });
        const { token: teacherToken } = await loginRes.json();
        console.log('✅ Teacher Logged In');

        // 2. Create Batch WITH Subject
        console.log('[2] Creating Batch with Subject "Physics"...');
        const batchRes = await fetch(`${BASE_URL}/teacher/batches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
            body: JSON.stringify({ name: 'Physics Class 12', timing: '10:00 AM', subject: 'Physics' })
        });
        const batchData = await batchRes.json();
        console.log('✅ Batch Created (ID: ' + batchData.id + ')');

        // 3. Verify Subject is persisted
        console.log('[3] Fetching Batches to verify Subject...');
        const listRes = await fetch(`${BASE_URL}/teacher/batches`, {
            headers: { 'Authorization': `Bearer ${teacherToken}` }
        });
        const batches = await listRes.json();
        const myBatch = batches.find(b => b.id === batchData.id);

        if (myBatch && myBatch.subject === 'Physics') {
            console.log(`✅ Success! Batch "${myBatch.name}" has subject "${myBatch.subject}"`);
        } else {
            throw new Error(`Subject verification failed. Expected 'Physics', got '${myBatch?.subject}'`);
        }

    } catch (err) {
        console.error('❌ Verification Failed:', err.message);
        process.exit(1);
    }
}

verifySubject();
