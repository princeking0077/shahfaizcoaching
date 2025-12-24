const BASE_URL = 'http://localhost:5000/api';

async function runWorkflow() {
    try {
        console.log('🚀 Starting Full Workflow Verification...');

        // --- STEP 1: Admin Login ---
        console.log('\n[1] Admin Login...');
        const adminRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const adminData = await adminRes.json();
        if (!adminData.token) throw new Error('Admin login failed');
        const adminToken = adminData.token;
        console.log('✅ Admin Logged In');

        // --- STEP 2: Create Teacher ---
        const teacherUsername = `teacher_${Date.now()}`;
        console.log(`\n[2] Creating Teacher (${teacherUsername})...`);
        const createTeacherRes = await fetch(`${BASE_URL}/admin/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify({
                name: 'Verify Teacher',
                username: teacherUsername,
                password: 'password',
                email: 'test@teacher.com'
            })
        });
        const teacherData = await createTeacherRes.json();
        if (!teacherData.id) throw new Error('Teacher creation failed');
        console.log('✅ Teacher Created');

        // --- STEP 3: Teacher Login ---
        console.log('\n[3] Teacher Login...');
        const teacherLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: teacherUsername, password: 'password' })
        });
        const teacherAuthData = await teacherLoginRes.json();
        const teacherToken = teacherAuthData.token;
        console.log('✅ Teacher Logged In');

        // --- STEP 4: Create Batch ---
        console.log('\n[4] Creating Batch...');
        const batchRes = await fetch(`${BASE_URL}/teacher/batches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
            body: JSON.stringify({ name: 'Verification Batch', timing: '10:00 AM' })
        });
        const batchData = await batchRes.json();
        console.log('✅ Batch Created (ID: ' + batchData.id + ')');

        // --- STEP 5: Add Student ---
        const studentName = `Student ${Date.now()}`;
        console.log(`\n[5] Adding Student (${studentName})...`);
        const studentRes = await fetch(`${BASE_URL}/teacher/batches/${batchData.id}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
            body: JSON.stringify({ name: studentName, parent_name: 'Parent', phone: '1234567890' })
        });
        const studentAuthData = await studentRes.json();
        // note: studentAuthData contains username/password, but we need the student ID for Fees/Marks.
        // The previous API response didn't return ID directly, but the 'students' list does.
        // Let's fetch the student list for the batch to get the ID.

        const studentsListRes = await fetch(`${BASE_URL}/teacher/batches/${batchData.id}/students`, {
            headers: { 'Authorization': `Bearer ${teacherToken}` }
        });
        const studentsList = await studentsListRes.json();
        const student = studentsList.find(s => s.name === studentName);
        if (!student) throw new Error('Student not found in batch list');
        console.log(`✅ Student Created & Found (ID: ${student.id})`);

        // --- STEP 6: Admin Adds Fee ---
        console.log('\n[6] Admin Adds Fee...');
        const feeRes = await fetch(`${BASE_URL}/admin/fees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify({ student_id: student.id, amount_total: 10000, due_date: '2025-05-01' })
        });
        const feeData = await feeRes.json();
        if (!feeData.success) throw new Error('Fee creation failed');
        console.log('✅ Fee Record Created');

        // --- STEP 7: Teacher Adds Marks ---
        console.log('\n[7] Teacher Uploads Marks...');
        const marksRes = await fetch(`${BASE_URL}/teacher/marks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
            body: JSON.stringify({
                batchId: batchData.id,
                exam_name: 'Final Verification Exam',
                subject: 'Science',
                marksList: [{ student_id: student.id, marks_obtained: 95, total_marks: 100 }]
            })
        });
        const marksData = await marksRes.json();
        if (!marksData.success) throw new Error('Marks upload failed');
        console.log('✅ Marks Uploaded');

        console.log('\n🎉 FULL WORKFLOW VERIFIED SUCCESSFULLY!');

    } catch (err) {
        console.error('\n❌ Workflow Verification Failed:', err.message);
        process.exit(1);
    }
}

runWorkflow();
