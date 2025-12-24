import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, Zap, Target, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-slate-900/50">
                <div className="container py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        <span className="text-white">Kalam</span>
                        <span className="text-yellow-400">Coaching</span>
                    </h1>
                    <Link to="/login" className="btn btn-primary px-6 py-2 text-sm">
                        Student Portal
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
                {/* Background Blobs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 max-w-4xl space-y-8 animate-enter">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-none bg-white/5 text-yellow-400 font-medium text-sm mb-4">
                        <Star size={16} fill="currentColor" />
                        <span>#1 Coaching Institute for Class 1-10</span>
                    </div>

                    <h2 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
                        Unleash Your <br />
                        <span className="text-gradient-gold">Inner Genius.</span>
                    </h2>

                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Precision learning crafted for excellence. We monitor every mark, attendance,
                        and milestone to ensure your child doesn't just pass, but <span className="text-white font-semibold">thrives</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link to="/login" className="btn btn-primary text-lg flex items-center justify-center gap-2 group">
                            Start Learning Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium text-slate-300">
                            View Syllabus
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Stats */}
            <section className="py-20 bg-slate-900/50 border-y border-white/5 relative z-10">
                <div className="container grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Users className="text-purple-400" size={32} />}
                        title="Elite Mentorship"
                        desc="1:1 attention from top-tier educators dedicated to student success."
                    />
                    <FeatureCard
                        icon={<Zap className="text-yellow-400" size={32} />}
                        title="Smart Analytics"
                        desc="Data-driven insights into attendance, marks, and learning curves."
                    />
                    <FeatureCard
                        icon={<Target className="text-blue-400" size={32} />}
                        title="Proven Results"
                        desc="Year-on-year record of academic excellence and top rankings."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card p-8 group cursor-default">
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

export default Home;
