import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, XCircle, DollarSign, LogOut, LayoutDashboard, Calendar, FileText, ChevronRight, Clock, Award } from 'lucide-react';

const StudentDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [fees, setFees] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            try {
                const pRes = await fetch('/api/student/profile', { headers });
                if (pRes.ok) setProfile(await pRes.json());

                const aRes = await fetch('/api/student/attendance', { headers });
                if (aRes.ok) setAttendance(await aRes.json());

                const fRes = await fetch('/api/student/fees', { headers });
                if (fRes.ok) setFees(await fRes.json());
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const presentCount = attendance.filter(a => a.status === 'present').length;
    const totalClasses = attendance.length;
    const percentage = totalClasses ? Math.round((presentCount / totalClasses) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 text-white z-20 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">K</div>
                        <span className="text-xl font-bold tracking-tight">Student Portal</span>
                    </div>
                </div>

                <div className="p-4 flex-1 space-y-2 mt-4">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={<Calendar size={20} />} label="Attendance History" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                    <SidebarItem icon={<FileText size={20} />} label="Fee Status" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72">
                <header className="bg-white h-20 border-b border-slate-200 sticky top-0 z-10 px-8 flex justify-between items-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-bold text-slate-900">{profile?.name || user?.username}</div>
                            <div className="text-xs text-slate-500">Class {profile?.batch_name || 'N/A'}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm">
                            {profile?.name?.charAt(0) || 'S'}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Welcome Banner */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.name?.split(' ')[0]}! 👋</h2>
                                    <p className="text-blue-100 opacity-90">Here is your daily activity update.</p>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard
                                    label="Attendance"
                                    value={`${percentage}%`}
                                    subtext={`${presentCount}/${totalClasses} Days Present`}
                                    icon={<CheckCircle size={24} className="text-green-600" />}
                                    color="bg-green-50 border-green-100"
                                />
                                <StatCard
                                    label="Fee Status"
                                    value={fees.length > 0 && fees[0].status === 'pending' ? 'Due' : 'Clear'}
                                    subtext={fees.length > 0 && fees[0].status === 'pending' ? `Due: ₹${fees[0].amount_total}` : 'No Pending Dues'}
                                    icon={<DollarSign size={24} className="text-yellow-600" />}
                                    color="bg-yellow-50 border-yellow-100"
                                />
                                <StatCard
                                    label="Next Class"
                                    value="10:00 AM"
                                    subtext="Mathematics"
                                    icon={<Clock size={24} className="text-blue-600" />}
                                    color="bg-blue-50 border-blue-100"
                                />
                            </div>

                            {/* Recent Activity Section */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Calendar size={18} className="text-slate-400" /> Recent Attendance
                                        </h3>
                                        <button onClick={() => setActiveTab('attendance')} className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {attendance.slice(0, 5).map((a, i) => (
                                            <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-10 rounded-full ${a.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <div>
                                                        <div className="font-semibold text-slate-700">{new Date(a.date).toLocaleDateString()}</div>
                                                        <div className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {a.status.toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                        {attendance.length === 0 && <div className="p-8 text-center text-slate-400">No attendance records found.</div>}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Award size={18} className="text-slate-400" /> Recent Results
                                        </h3>
                                    </div>
                                    <div className="p-8 text-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText size={32} className="text-slate-400" />
                                        </div>
                                        <p>No recent exam results available.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ATTENDANCE TAB */}
                    {activeTab === 'attendance' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Day</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {attendance.map((a, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="p-4 font-medium text-slate-800">{new Date(a.date).toLocaleDateString()}</td>
                                            <td className="p-4 text-slate-500">{new Date(a.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {a.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* FEES TAB */}
                    {activeTab === 'fees' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {fees.map(f => (
                                <div key={f.id} className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center hover:bg-slate-50">
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                        <div className={`p-4 rounded-full ${f.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            <DollarSign size={24} />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-slate-900">Tuition Fee</div>
                                            <div className="text-slate-500 text-sm">Due Date: {new Date(f.due_date).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center gap-8">
                                        <div>
                                            <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Total Amount</div>
                                            <div className="text-xl font-bold text-slate-800">₹{f.amount_total}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Paid</div>
                                            <div className="text-xl font-bold text-green-600">₹{f.amount_paid}</div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg font-bold ${f.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {f.status.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {fees.length === 0 && <div className="p-12 text-center text-slate-500">No fee records found. You are all clear!</div>}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const StatCard = ({ label, value, subtext, icon, color }) => (
    <div className={`p-6 rounded-2xl border ${color} bg-white shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-500 font-medium text-sm mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${color.split(' ')[0]} bg-opacity-50`}>{icon}</div>
        </div>
        <p className="text-xs font-medium text-slate-400">{subtext}</p>
    </div>
);

export default StudentDashboard;
