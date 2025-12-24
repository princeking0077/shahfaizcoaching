import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Calendar, ChevronLeft, Plus, CheckCircle, XCircle, LogOut } from 'lucide-react';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [showCreateBatch, setShowCreateBatch] = useState(false);
    const [showAddStudent, setShowAddStudent] = useState(false);

    // Forms
    const [newBatch, setNewBatch] = useState({ name: '', timing: '', subject: '' });
    const [newStudent, setNewStudent] = useState({ name: '', parent_name: '', phone: '' });

    // Attendance
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceStatus, setAttendanceStatus] = useState({}); // { studentId: 'present' | 'absent' }

    // Marks
    const [showMarksModal, setShowMarksModal] = useState(false);
    const [examData, setExamData] = useState({ exam_name: '', subject: '', total_marks: '' });
    const [marksInput, setMarksInput] = useState({}); // { studentId: marks }

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) fetchStudents(selectedBatch.id);
    }, [selectedBatch]);

    const fetchBatches = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/teacher/batches', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setBatches(await res.json());
    };

    const fetchStudents = async (batchId) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/teacher/batches/${batchId}/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setStudents(data);
            // Init attendance status
            const initialStatus = {};
            data.forEach(s => initialStatus[s.id] = 'present');
            setAttendanceStatus(initialStatus);
        }
    };

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/teacher/batches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newBatch)
        });
        if (res.ok) {
            setShowCreateBatch(false);
            setNewBatch({ name: '', timing: '', subject: '' });
            fetchBatches();
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/teacher/batches/${selectedBatch.id}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newStudent)
        });
        if (res.ok) {
            setShowAddStudent(false);
            setNewStudent({ name: '', parent_name: '', phone: '' });
            fetchStudents(selectedBatch.id);
            alert('Student added! Credentials generated on server (check response in real app)');
        }
    };

    const submitAttendance = async () => {
        const token = localStorage.getItem('token');
        const attendanceList = students.map(s => ({
            id: s.id,
            status: attendanceStatus[s.id]
        }));

        const res = await fetch('http://localhost:5000/api/teacher/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                batchId: selectedBatch.id,
                date: attendanceDate,
                students: attendanceList
            })
        });

        if (res.ok) alert('Attendance Marked Successfully');
        else alert('Error marking attendance');
    };

    const submitMarks = async () => {
        const token = localStorage.getItem('token');
        const marksList = students.map(s => ({
            student_id: s.id,
            marks_obtained: marksInput[s.id] || 0,
            total_marks: examData.total_marks
        }));

        const res = await fetch('http://localhost:5000/api/teacher/marks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                batchId: selectedBatch.id,
                exam_name: examData.exam_name,
                subject: examData.subject,
                marksList
            })
        });

        if (res.ok) {
            alert('Marks Uploaded Successfully');
            setShowMarksModal(false);
            setMarksInput({});
            setExamData({ exam_name: '', subject: '', total_marks: '' });
        } else {
            alert('Error uploading marks');
        }
    };

    if (!selectedBatch) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                        <p className="text-gray-400">Manage your batches and students</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => logout()} className="btn bg-red-600 hover:bg-red-700">Logout</button>
                        <button onClick={() => setShowCreateBatch(true)} className="btn btn-primary flex items-center gap-2"><Plus size={18} /> New Batch</button>
                    </div>
                </header>

                {showCreateBatch && (
                    <div className="glass-card mb-8 animate-fade-in p-6 max-w-xl mx-auto">
                        <h3 className="text-xl font-bold mb-4">Create New Batch</h3>
                        <form onSubmit={handleCreateBatch} className="grid gap-4">
                            <input required placeholder="Batch Name (e.g. Class 10)" className="p-3 rounded bg-gray-700 border border-gray-600" value={newBatch.name} onChange={e => setNewBatch({ ...newBatch, name: e.target.value })} />
                            <input required placeholder="Subject (e.g. Mathematics)" className="p-3 rounded bg-gray-700 border border-gray-600" value={newBatch.subject} onChange={e => setNewBatch({ ...newBatch, subject: e.target.value })} />
                            <input required placeholder="Timing (e.g. 10:00 AM)" className="p-3 rounded bg-gray-700 border border-gray-600" value={newBatch.timing} onChange={e => setNewBatch({ ...newBatch, timing: e.target.value })} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowCreateBatch(false)} className="text-gray-400">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    {batches.map(batch => (
                        <div key={batch.id} onClick={() => setSelectedBatch(batch)} className="glass-card cursor-pointer hover:border-yellow-500 transition-colors group">
                            <h3 className="text-2xl font-bold mb-1 group-hover:text-yellow-400">{batch.name}</h3>
                            <p className="text-yellow-500 font-bold text-sm mb-2">{batch.subject || 'General'}</p>
                            <div className="flex items-center gap-2 text-gray-400"><Clock size={16} /> {batch.timing}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <button onClick={() => setSelectedBatch(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ChevronLeft /> Back to Batches
            </button>

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-yellow-500">{selectedBatch.name}</h1>
                    <p className="text-gray-400">Timing: {selectedBatch.timing}</p>
                </div>
                <button onClick={() => setShowAddStudent(true)} className="btn btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Student
                </button>
            </header>

            {showAddStudent && (
                <div className="glass-card mb-8 animate-fade-in p-6 max-w-xl mx-auto">
                    <h3 className="text-xl font-bold mb-4">Add Student to Batch</h3>
                    <form onSubmit={handleAddStudent} className="grid gap-4">
                        <input required placeholder="Student Name" className="p-3 rounded bg-gray-700 border border-gray-600" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} />
                        <input required placeholder="Parent Name" className="p-3 rounded bg-gray-700 border border-gray-600" value={newStudent.parent_name} onChange={e => setNewStudent({ ...newStudent, parent_name: e.target.value })} />
                        <input required placeholder="Phone Number" className="p-3 rounded bg-gray-700 border border-gray-600" value={newStudent.phone} onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowAddStudent(false)} className="text-gray-400">Cancel</button>
                            <button type="submit" className="btn btn-primary">Add Student</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users /> Students ({students.length})</h2>
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        {students.map(s => (
                            <div key={s.id} className="p-4 border-b border-gray-700 flex justify-between items-center last:border-0 hover:bg-gray-750">
                                <div>
                                    <h4 className="font-bold">{s.name}</h4>
                                    <p className="text-sm text-gray-400">Parent: {s.parent_name} | {s.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="glass-card sticky top-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar /> Mark Attendance</h2>
                        <input
                            type="date"
                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 mb-4"
                            value={attendanceDate}
                            onChange={e => setAttendanceDate(e.target.value)}
                        />

                        <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
                            {students.map(s => (
                                <div key={s.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                                    <span>{s.name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setAttendanceStatus({ ...attendanceStatus, [s.id]: 'present' })}
                                            className={`p-1 rounded ${attendanceStatus[s.id] === 'present' ? 'text-green-400' : 'text-gray-600'}`}
                                        ><CheckCircle /></button>
                                        <button
                                            onClick={() => setAttendanceStatus({ ...attendanceStatus, [s.id]: 'absent' })}
                                            className={`p-1 rounded ${attendanceStatus[s.id] === 'absent' ? 'text-red-400' : 'text-gray-600'}`}
                                        ><XCircle /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={submitAttendance} className="w-full btn btn-primary">Save Attendance</button>
                    </div>

                    {/* Marks Upload Section */}
                    <div className="glass-card mt-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"> Upload Marks</h2>
                        <button className="w-full btn bg-purple-600 hover:bg-purple-700" onClick={() => setShowMarksModal(true)}>
                            Enter Exam Marks
                        </button>
                    </div>
                </div>
            </div>

            {/* Marks Modal */}
            {showMarksModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
                    <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Enter Marks: {selectedBatch.name}</h2>
                            <button onClick={() => setShowMarksModal(false)} className="text-gray-400 hover:text-white"><XCircle size={24} /></button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <input placeholder="Exam Name (e.g. Mid Term)" className="p-3 rounded bg-gray-700 border border-gray-600" value={examData.exam_name} onChange={e => setExamData({ ...examData, exam_name: e.target.value })} />
                            <input placeholder="Subject (e.g. Math)" className="p-3 rounded bg-gray-700 border border-gray-600" value={examData.subject} onChange={e => setExamData({ ...examData, subject: e.target.value })} />
                            <input placeholder="Total Marks" type="number" className="p-3 rounded bg-gray-700 border border-gray-600" value={examData.total_marks} onChange={e => setExamData({ ...examData, total_marks: e.target.value })} />
                        </div>

                        <div className="space-y-2 mb-6">
                            {students.map(s => (
                                <div key={s.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                                    <span className="font-bold">{s.name}</span>
                                    <input
                                        type="number"
                                        placeholder="Marks"
                                        className="w-24 p-2 rounded bg-gray-700 border border-gray-600 text-center"
                                        onChange={e => setMarksInput({ ...marksInput, [s.id]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>

                        <button onClick={submitMarks} className="w-full btn btn-primary">Submit Result</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
