import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, XCircle, DollarSign, LogOut } from 'lucide-react';

const StudentDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [fees, setFees] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            try {
                const pRes = await fetch('http://localhost:5000/api/student/profile', { headers });
                if (pRes.ok) setProfile(await pRes.json());

                const aRes = await fetch('http://localhost:5000/api/student/attendance', { headers });
                if (aRes.ok) setAttendance(await aRes.json());

                const fRes = await fetch('http://localhost:5000/api/student/fees', { headers });
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
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-yellow-500">Student Portal</h1>
                    <p className="text-gray-400">Welcome, {profile?.name}</p>
                </div>
                <button onClick={handleLogout} className="btn bg-red-600 hover:bg-red-700 flex items-center gap-2">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card flex items-center gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Batch</h3>
                        <p className="text-gray-400">{profile?.batch_name || 'Not Assigned'}</p>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-4">
                    <div className="bg-green-500/20 p-3 rounded-full text-green-400">
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Attendance</h3>
                        <p className="text-2xl text-white">{percentage}% ({presentCount}/{totalClasses})</p>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-400">
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Fee Status</h3>
                        <p className="text-gray-400">
                            {fees.length > 0 ? fees[0].status.toUpperCase() : 'No Dues'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Attendance */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Recent Attendance</h2>
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        {attendance.slice(0, 5).map(a => (
                            <div key={a.id} className="p-4 border-b border-gray-700 flex justify-between items-center last:border-0 hover:bg-gray-750">
                                <span>{a.date}</span>
                                <span className={`px-2 py-1 rounded text-sm ${a.status === 'present' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {a.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                        {attendance.length === 0 && <p className="p-4 text-gray-500">No records found.</p>}
                    </div>
                </div>

                {/* Fees */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Fee History</h2>
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        {fees.map(f => (
                            <div key={f.id} className="p-4 border-b border-gray-700 flex justify-between items-center last:border-0">
                                <div>
                                    <p className="font-bold">Total: ₹{f.amount_total}</p>
                                    <p className="text-sm text-gray-400">Paid: ₹{f.amount_paid}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`block px-2 py-1 rounded text-sm mb-1 ${f.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {f.status.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">Due: {f.due_date}</span>
                                </div>
                            </div>
                        ))}
                        {fees.length === 0 && <p className="p-4 text-gray-500">No fee records found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
