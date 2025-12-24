// Native fetch is available in Node 18+
const BASE_URL = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

async function verify() {
    try {
        console.log('--- Starting Verification V2 (Native Fetch) ---');

        // 1. Login as Admin
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ADMIN_CREDENTIALS)
        });
        const { token } = await loginRes.json();
        if (!token) throw new Error('Login failed');
        console.log('✅ Admin Logged In');

        // 2. Fetch Students (Need an ID)
        console.log('2. Fetching Students...');
        const studentsRes = await fetch(`${BASE_URL}/admin/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const students = await studentsRes.json();
        console.log(`✅ Fetched ${students.length} students`);

        if (students.length > 0) {
            const studentId = students[0].id; // Use real student ID from DB

            // 3. Create Fee Record
            console.log(`3. Creating Fee Record for Student ID: ${studentId}...`);
            const feeRes = await fetch(`${BASE_URL}/admin/fees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student_id: studentId,
                    amount_total: 5000,
                    due_date: '2025-01-01'
                })
            });

            // Handle response safely
            const feeText = await feeRes.text();
            try {
                const feeData = JSON.parse(feeText);
                if (!feeData.success && !feeData.id) throw new Error('Fee creation failed: ' + JSON.stringify(feeData));
                console.log('✅ Fee Record Created. ID:', feeData.id);
            } catch (e) {
                console.error('Failed to parse fee response:', feeText);
                throw e;
            }

        } else {
            console.log('⚠️ Skipping Fee Creation (No students found - Ensure you created a student first!)');
        }

        console.log('--- Verification Complete ---');
    } catch (err) {
        console.error('❌ Verification Failed:', err.message);
        process.exit(1);
    }
}

verify();
