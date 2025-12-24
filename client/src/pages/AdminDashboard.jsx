import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Plus, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('teachers');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddTeacher, setShowAddTeacher] = useState(false);

    // Form State
    const [newTeacher, setNewTeacher] = useState({ name: '', username: '', email: '', password: '' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (activeTab === 'teachers') {
                const res = await fetch('http://localhost:5000/api/admin/teachers', { headers });
                if (res.ok) setTeachers(await res.json());
            } else if (activeTab === 'students') {
                const res = await fetch('http://localhost:5000/api/admin/students', { headers });
                if (res.ok) setStudents(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/admin/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTeacher)
            });
            if (res.ok) {
                setShowAddTeacher(false);
                setNewTeacher({ name: '', username: '', email: '', password: '' });
                fetchData(); // Refresh list
            } else {
                alert('Failed to add teacher');
            }
        } catch (err) {
            alert('Error adding teacher');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-yellow-400 mb-8">Admin Panel</h2>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<Users />} label="Teachers" active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
                    <SidebarItem icon={<BookOpen />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                    <SidebarItem icon={<DollarSign />} label="Fees" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white mt-auto">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold capitalize">{activeTab} Management</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">Welcome, {user?.name}</span>
                    </div>
                </header>

                {/* Teachers Tab */}
                {activeTab === 'teachers' && (
                    <div>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setShowAddTeacher(!showAddTeacher)}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Plus size={18} /> Add Teacher
                            </button>
                        </div>

                        {showAddTeacher && (
                            <div className="glass-card mb-8 animate-fade-in p-6">
                                <h3 className="text-xl font-bold mb-4">New Teacher Details</h3>
                                <form onSubmit={handleAddTeacher} className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Name" className="p-3 rounded bg-gray-700 border border-gray-600" value={newTeacher.name} onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })} />
                                    <input required placeholder="Username" className="p-3 rounded bg-gray-700 border border-gray-600" value={newTeacher.username} onChange={e => setNewTeacher({ ...newTeacher, username: e.target.value })} />
                                    <input required placeholder="Email" type="email" className="p-3 rounded bg-gray-700 border border-gray-600" value={newTeacher.email} onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })} />
                                    <input required placeholder="Password" type="password" className="p-3 rounded bg-gray-700 border border-gray-600" value={newTeacher.password} onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })} />
                                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                                        <button type="button" onClick={() => setShowAddTeacher(false)} className="text-gray-400 hover:text-white px-4">Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save Teacher</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {teachers.map(t => (
                                <div key={t.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                                    <div>
                                        <h4 className="font-bold text-lg">{t.name}</h4>
                                        <p className="text-sm text-gray-400">@{t.username} | {t.email}</p>
                                    </div>
                                    <button className="text-blue-400 hover:text-blue-300">Edit</button>
                                </div>
                            ))}
                            {teachers.length === 0 && !loading && <p className="text-gray-500">No teachers found.</p>}
                        </div>
                    </div>
                )}

                {/* Student List */}
                {activeTab === 'students' && (
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Batch</th>
                                    <th className="p-4">Parent</th>
                                    <th className="p-4">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-750">
                                        <td className="p-4 font-bold">{s.name}</td>
                                        <td className="p-4">{s.batch_name || 'Unassigned'}</td>
                                        <td className="p-4">{s.parent_name}</td>
                                        <td className="p-4">{s.phone}</td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr><td colSpan="4" className="p-6 text-center text-gray-500">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Fees Management */}
            {activeTab === 'fees' && (
                <div className="p-8 w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">Fee Management</h2>
                        <button className="btn btn-primary flex items-center gap-2" onClick={() => alert("To add fee, please select a student first (Feature simplification: Select 'Create Fee' below)")}>
                            <Plus size={18} /> Add Fee Info
                        </button>
                    </div>

                    {/* Fee Creation Form (Inline for simplicity) */}
                    <div className="glass-card mb-8">
                        <h3 className="font-bold mb-4">Create New Fee Record</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const token = localStorage.getItem('token');
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());

                            fetch('http://localhost:5000/api/admin/fees', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify(data)
                            }).then(res => {
                                if (res.ok) { alert('Fee Record Created'); window.location.reload(); }
                            });
                        }} className="grid grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Student ID</label>
                                <input name="student_id" placeholder="Student ID" className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Amount</label>
                                <input name="amount_total" placeholder="Total Amount" className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                                <input name="due_date" type="date" className="w-full p-2 rounded bg-gray-700 border border-gray-600" required />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Fee</button>
                        </form>
                        <p className="text-xs text-gray-500 mt-2">* Check Student ID from Students tab</p>
                    </div>

                    <FeeManager />
                </div>
            )}
        </div>
    );
};

// Sub-component for Fees to keep main refined
const FeeManager = () => {
    const [fees, setFees] = useState([]);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/fees', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setFees(await res.json());
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-300">
                    <tr>
                        <th className="p-4">Student</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Paid</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {fees.map(f => (
                        <tr key={f.id} className="border-b border-gray-700">
                            <td className="p-4">
                                <div className="font-bold">{f.student_name}</div>
                                <div className="text-xs text-gray-400">{f.batch_name}</div>
                            </td>
                            <td className="p-4">₹{f.amount_total}</td>
                            <td className="p-4 text-green-400">₹{f.amount_paid}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs ${f.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{f.status.toUpperCase()}</span>
                            </td>
                            <td className="p-4">
                                <button className="text-blue-400 hover:text-blue-300">Update</button>
                            </td>
                        </tr>
                    ))}
                    {fees.length === 0 && (
                        <tr><td colSpan="5" className="p-6 text-center text-gray-500">No fee records found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-yellow-500 text-black font-bold' : 'text-gray-400 hover:bg-gray-700'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default AdminDashboard;
