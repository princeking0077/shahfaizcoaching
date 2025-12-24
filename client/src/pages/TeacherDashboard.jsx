import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Calendar, ChevronLeft, Plus, CheckCircle, XCircle, LogOut, BookOpen, GraduationCap, LayoutDashboard, ChevronRight } from 'lucide-react';

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
    const [attendanceStatus, setAttendanceStatus] = useState({});

    // Marks
    const [showMarksModal, setShowMarksModal] = useState(false);
    const [examData, setExamData] = useState({ exam_name: '', subject: '', total_marks: '' });
    const [marksInput, setMarksInput] = useState({});

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) fetchStudents(selectedBatch.id);
    }, [selectedBatch]);

    const fetchBatches = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/teacher/batches', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setBatches(await res.json());
    };

    const fetchStudents = async (batchId) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/teacher/batches/${batchId}/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setStudents(data);
            const initialStatus = {};
            data.forEach(s => initialStatus[s.id] = 'present');
            setAttendanceStatus(initialStatus);
        }
    };

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('/api/teacher/batches', {
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
        const res = await fetch(`/api/teacher/batches/${selectedBatch.id}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newStudent)
        });
        if (res.ok) {
            setShowAddStudent(false);
            setNewStudent({ name: '', parent_name: '', phone: '' });
            fetchStudents(selectedBatch.id);
        }
    };

    const submitAttendance = async () => {
        const token = localStorage.getItem('token');
        const attendanceList = students.map(s => ({
            id: s.id,
            status: attendanceStatus[s.id]
        }));

        const res = await fetch('/api/teacher/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                batchId: selectedBatch.id,
                date: attendanceDate,
                students: attendanceList
            })
        });

        if (res.ok) alert('Attendance Marked Successfully');
    };

    const submitMarks = async () => {
        const token = localStorage.getItem('token');
        const marksList = students.map(s => ({
            student_id: s.id,
            marks_obtained: marksInput[s.id] || 0,
            total_marks: examData.total_marks
        }));

        const res = await fetch('/api/teacher/marks', {
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
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 text-white z-20 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">K</div>
                        <span className="text-xl font-bold tracking-tight">Kalam Teacher</span>
                    </div>
                </div>

                <div className="p-4 flex-1 space-y-2 mt-4">
                    <button onClick={() => setSelectedBatch(null)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${!selectedBatch ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <LayoutDashboard size={20} />
                        <span>My Batches</span>
                    </button>
                    {selectedBatch && (
                        <div className="ml-4 pl-4 border-l border-slate-800 space-y-2 mt-2">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Selected: {selectedBatch.name}</div>
                            <button className="flex items-center gap-2 text-blue-400 text-sm font-medium"><Users size={16} /> Students</button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"><Calendar size={16} /> Attendance</button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"><BookOpen size={16} /> Marks</button>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72">
                <header className="bg-white h-20 border-b border-slate-200 sticky top-0 z-10 px-8 flex justify-between items-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-800">
                        {selectedBatch ? <span className="flex items-center gap-2 text-slate-500">Batches <ChevronRight size={20} /> <span className="text-slate-900">{selectedBatch.name}</span></span> : 'Dashboard Overview'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-bold text-slate-900">{user?.name || 'Teacher'}</div>
                            <div className="text-xs text-slate-500">Faculty Member</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm">T</div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">

                    {/* BATCH SELECTION SCREEN */}
                    {!selectedBatch && (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">My Classes</h2>
                                    <p className="text-slate-500">Select a batch to manage attendance and marks.</p>
                                </div>
                                <button onClick={() => setShowCreateBatch(true)} className="btn btn-primary flex items-center gap-2">
                                    <Plus size={20} /> Create New Batch
                                </button>
                            </div>

                            {showCreateBatch && (
                                <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in-up max-w-2xl">
                                    <h3 className="font-bold text-lg mb-4 text-slate-800">Create New Batch</h3>
                                    <form onSubmit={handleCreateBatch} className="grid grid-cols-2 gap-4">
                                        <input required placeholder="Batch Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={newBatch.name} onChange={e => setNewBatch({ ...newBatch, name: e.target.value })} />
                                        <input required placeholder="Subject" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={newBatch.subject} onChange={e => setNewBatch({ ...newBatch, subject: e.target.value })} />
                                        <input required placeholder="Timing" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={newBatch.timing} onChange={e => setNewBatch({ ...newBatch, timing: e.target.value })} />
                                        <div className="flex items-center justify-end gap-2 col-span-2 mt-2">
                                            <button type="button" onClick={() => setShowCreateBatch(false)} className="btn btn-outline py-2">Cancel</button>
                                            <button type="submit" className="btn btn-primary py-2">Create Batch</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {batches.map(batch => (
                                    <div key={batch.id} onClick={() => setSelectedBatch(batch)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <GraduationCap size={100} className="text-blue-600" />
                                        </div>
                                        <div className="relative z-10">
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 mb-4">{batch.subject || 'General'}</span>
                                            <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{batch.name}</h3>
                                            <div className="flex items-center gap-2 text-slate-500 mt-4 font-medium">
                                                <Clock size={18} /> {batch.timing || 'Flexible Timing'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* BATCH DETAIL SCREEN */}
                    {selectedBatch && (
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <Users className="text-blue-600" /> Students List
                                            <span className="bg-slate-200 text-slate-600 text-xs py-1 px-2 rounded-full">{students.length}</span>
                                        </h2>
                                        <button onClick={() => setShowAddStudent(true)} className="btn btn-outline py-1.5 px-3 text-sm flex items-center gap-2 bg-white">
                                            <Plus size={16} /> Add Student
                                        </button>
                                    </div>

                                    {showAddStudent && (
                                        <div className="p-6 bg-blue-50/50 border-b border-blue-100 animate-fade-in">
                                            <form onSubmit={handleAddStudent} className="flex gap-3">
                                                <input required placeholder="Student Name" className="flex-1 p-2 rounded border border-slate-300" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} />
                                                <input required placeholder="Phone" className="w-32 p-2 rounded border border-slate-300" value={newStudent.phone} onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} />
                                                <button type="submit" className="btn btn-primary py-2 px-4 shadow-none">Add</button>
                                                <button type="button" onClick={() => setShowAddStudent(false)} className="px-3 text-slate-400 hover:text-red-500"><XCircle /></button>
                                            </form>
                                        </div>
                                    )}

                                    <div className="divide-y divide-slate-100">
                                        {students.map(s => (
                                            <div key={s.id} className="p-4 hover:bg-slate-50 flex justify-between items-center transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                                        {s.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{s.name}</div>
                                                        <div className="text-xs text-slate-500">{s.phone}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setAttendanceStatus({ ...attendanceStatus, [s.id]: 'present' })} className={`p-2 rounded-lg transition-colors ${attendanceStatus[s.id] === 'present' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button onClick={() => setAttendanceStatus({ ...attendanceStatus, [s.id]: 'absent' })} className={`p-2 rounded-lg transition-colors ${attendanceStatus[s.id] === 'absent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {students.length === 0 && <div className="p-8 text-center text-slate-400">No students in this batch yet.</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Actions Card */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button onClick={submitAttendance} className="w-full btn btn-primary flex justify-center items-center gap-2">
                                            <Calendar size={18} /> Submit Attendance
                                        </button>
                                        <button onClick={() => setShowMarksModal(true)} className="w-full btn btn-outline flex justify-center items-center gap-2">
                                            <BookOpen size={18} /> Upload Marks
                                        </button>
                                    </div>
                                </div>

                                {/* Attendance Date Picker */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Attendance Date</label>
                                    <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Marks Modal */}
            {showMarksModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Upload Marks</h2>
                            <button onClick={() => setShowMarksModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <input placeholder="Exam Name" className="p-3 border rounded-lg" value={examData.exam_name} onChange={e => setExamData({ ...examData, exam_name: e.target.value })} />
                                <input placeholder="Subject" className="p-3 border rounded-lg" value={examData.subject} onChange={e => setExamData({ ...examData, subject: e.target.value })} />
                                <input placeholder="Total Marks" type="number" className="p-3 border rounded-lg" value={examData.total_marks} onChange={e => setExamData({ ...examData, total_marks: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                {students.map(s => (
                                    <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="font-semibold text-slate-700">{s.name}</span>
                                        <input type="number" placeholder="0" className="w-24 p-2 border border-slate-300 rounded text-center" onChange={e => setMarksInput({ ...marksInput, [s.id]: e.target.value })} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50">
                            <button onClick={submitMarks} className="w-full btn btn-primary">Submit Results</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
