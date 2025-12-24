import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Plus, LogOut, LayoutDashboard, Search, Bell, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('teachers');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddTeacher, setShowAddTeacher] = useState(false);
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newTeacher)
            });
            if (res.ok) {
                setShowAddTeacher(false);
                setNewTeacher({ name: '', username: '', email: '', password: '' });
                fetchData();
            } else {
                alert('Failed to add teacher');
            }
        } catch (err) {
            alert('Error adding teacher');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 text-white z-20 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">K</div>
                        <span className="text-xl font-bold tracking-tight">Kalam Admin</span>
                    </div>
                </div>

                <div className="p-4 flex-1 space-y-2 mt-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">Main Menu</div>
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={false} onClick={() => { }} />
                    <SidebarItem icon={<Users size={20} />} label="Teachers" active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
                    <SidebarItem icon={<BookOpen size={20} />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                    <SidebarItem icon={<DollarSign size={20} />} label="Fee Management" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
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
                {/* Header */}
                <header className="bg-white h-20 border-b border-slate-200 sticky top-0 z-10 px-8 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
                        <Search size={20} className="text-slate-400" />
                        <input placeholder="Search records..." className="bg-transparent border-none outline-none text-slate-700 w-full" />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 capitalize mb-2">{activeTab}</h1>
                            <p className="text-slate-500">Manage your institute's {activeTab} data efficiently.</p>
                        </div>
                        {activeTab === 'teachers' && (
                            <button onClick={() => setShowAddTeacher(true)} className="btn btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                <Plus size={20} /> Add New Teacher
                            </button>
                        )}
                    </div>

                    {/* Stats Cards Row (Placeholder for "Overview") */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <StatCard label="Total Students" value="1,240" color="bg-blue-500" />
                        <StatCard label="Active Teachers" value="48" color="bg-indigo-500" />
                        <StatCard label="Pending Fees" value="₹ 2.5L" color="bg-orange-500" />
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                        {/* Teachers Tab */}
                        {activeTab === 'teachers' && (
                            <div className="p-6">
                                {showAddTeacher && (
                                    <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in-up">
                                        <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Teacher</h3>
                                        <form onSubmit={handleAddTeacher} className="grid grid-cols-2 gap-4">
                                            <input required placeholder="Full Name" className="input-field" value={newTeacher.name} onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })} />
                                            <input required placeholder="Username" className="input-field" value={newTeacher.username} onChange={e => setNewTeacher({ ...newTeacher, username: e.target.value })} />
                                            <input required placeholder="Email Address" type="email" className="input-field" value={newTeacher.email} onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })} />
                                            <input required placeholder="Password" type="password" className="input-field" value={newTeacher.password} onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })} />
                                            <div className="col-span-2 flex justify-end gap-3 mt-2">
                                                <button type="button" onClick={() => setShowAddTeacher(false)} className="btn btn-outline py-2">Cancel</button>
                                                <button type="submit" className="btn btn-primary py-2">Save Teacher</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {teachers.map(t => (
                                        <div key={t.id} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow bg-slate-50 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                                                    {t.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{t.name}</h4>
                                                    <p className="text-sm text-slate-500">@{t.username}</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                                <Settings size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {teachers.length === 0 && !loading && <p className="text-slate-500 col-span-3 text-center py-10">No teachers found.</p>}
                                </div>
                            </div>
                        )}

                        {/* Students Tab */}
                        {activeTab === 'students' && (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="p-6">Student Name</th>
                                        <th className="p-6">Batch</th>
                                        <th className="p-6">Parent Info</th>
                                        <th className="p-6">Contact</th>
                                        <th className="p-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((s) => (
                                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-slate-900">{s.name}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                                    {s.batch_name || 'Unassigned'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-slate-600">{s.parent_name}</td>
                                            <td className="p-6 text-slate-600">{s.phone}</td>
                                            <td className="p-6">
                                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
                                                <span className="text-green-600 font-medium text-sm">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Fees Tab */}
                        {activeTab === 'fees' && (
                            <div className="p-8 text-center text-slate-500">
                                <FeesModule />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Simplified Stats Component
const StatCard = ({ label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} opacity-20`}></div>
    </div>
);

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const FeesModule = () => (
    <div className="p-4">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Fee Management Placeholder</h3>
        <p>Use the 'Add Fee' logic similar to the 'Add Teacher' modal.</p>
    </div>
)

export default AdminDashboard;
