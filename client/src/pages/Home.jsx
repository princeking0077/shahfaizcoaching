import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-slate-50 min-h-screen text-slate-900">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Kalam Coaching</span>
                    </div>
                    <div className="hidden md:flex gap-8">
                        <a href="#" className="nav-link">About</a>
                        <a href="#" className="nav-link">Courses</a>
                        <a href="#" className="nav-link">Faculty</a>
                        <a href="#" className="nav-link">Contact</a>
                    </div>
                    <Link to="/login" className="btn btn-primary text-sm py-2 px-4 shadow-none">
                        Student Login
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-white pt-20 pb-20 lg:pt-32 lg:pb-32 border-b border-slate-100">
                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-medium text-sm border border-blue-100">
                            🚀 Admissions Open for 2024-25
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                            Building the <span className="text-blue-600">Foundation</span> <br />
                            of Future Leaders.
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                            Premier coaching for Class 1 to 10. We combine expert pedagogical methods with advanced performance tracking to ensure every student excels.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/login" className="btn btn-primary text-lg flex justify-center items-center gap-2">
                                Get Started <ArrowRight size={18} />
                            </Link>
                            <button className="btn btn-outline text-lg">
                                View Syllabus
                            </button>
                        </div>

                        <div className="pt-8 flex gap-8 text-slate-500 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" /> 100% Results
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" /> Expert Faculty
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" /> Modern Labs
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Graphic */}
                    <div className="relative lg:h-[500px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xl lg:order-last order-first">
                        {/* Abstract Education Graphic representation */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                            <div className="text-center space-y-4">
                                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center mb-4">
                                    <BookOpen size={48} className="text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">Learn. Grow. Excel.</h3>
                                <div className="flex justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Kalam Coaching?</h2>
                        <p className="text-slate-600 text-lg">We provide a holistic learning environment that balances academic rigor with personal growth.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="text-blue-600" size={32} />}
                            title="Personalized Mentorship"
                            desc="Small batch sizes ensure every student receives individual attention from our expert faculty."
                        />
                        <FeatureCard
                            icon={<Smartphone className="text-indigo-600" size={32} />}
                            title="Digital Progress Tracking"
                            desc="Parents can track marks, attendance, and assignment status in real-time via our portal."
                        />
                        <FeatureCard
                            icon={<Award className="text-purple-600" size={32} />}
                            title="Proven Track Record"
                            desc="Consistently producing state toppers and distinction holders for the past 5 years."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
        <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
);

export default Home;
