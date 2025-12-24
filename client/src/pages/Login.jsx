import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                login(data.token, data.user);
                if (data.user.role === 'admin') navigate('/admin');
                else if (data.user.role === 'teacher') navigate('/teacher');
                else navigate('/student');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">K</div>
                        <span className="text-2xl font-bold tracking-tight">Kalam Coaching</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Welcome back to <br />
                        <span className="text-blue-500">Excellence.</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md">
                        Manage your institute, track student performance, and achieve academic milestones with our advanced portal.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={24} />
                        <span className="font-medium">Secure Role-Based Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={24} />
                        <span className="font-medium">Real-time Dashboard Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={24} />
                        <span className="font-medium">Instant Attendance Tracking</span>
                    </div>
                </div>

                {/* Abstract decorative circles */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                        <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 mb-6 text-sm">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                    placeholder="admin / teacher / student"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full btn btn-primary py-4 text-base font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            Sign In to Dashboard <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
                        Having trouble logging in? <a href="#" className="text-blue-600 font-semibold hover:underline">Contact Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
