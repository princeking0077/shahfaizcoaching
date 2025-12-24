import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, CheckCircle, Smartphone, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';

const Home = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 font-sans scroll-smooth">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">K</div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Kalam Coaching</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 font-medium text-slate-600">
                        <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
                        <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
                        <a href="#faculty" className="hover:text-blue-600 transition-colors">Faculty</a>
                        <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
                    </div>

                    <div className="hidden md:block">
                        <Link to="/login" className="btn btn-primary text-sm py-2.5 px-5 shadow-lg shadow-blue-500/30 rounded-full">
                            Student Portal
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-fade-in">
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            <a href="#about" className="py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>About</a>
                            <a href="#courses" className="py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Courses</a>
                            <a href="#faculty" className="py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Faculty</a>
                            <a href="#contact" className="py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                            <hr className="border-slate-100" />
                            <Link to="/login" className="btn btn-primary text-center py-3 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                Student Portal Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="bg-white pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-slate-100 relative overflow-hidden">
                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    <div className="space-y-6 lg:space-y-8 animate-fade-in-up order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-bold text-xs border border-blue-100 uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Admissions Open 2024-25
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                            Unlock Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">True Potential.</span>
                        </h1>
                        <p className="text-base lg:text-lg text-slate-600 max-w-lg leading-relaxed">
                            Join the region's premier coaching institute. We combine expert pedagogy, modern technology, and personalized mentorship to create toppers properly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link to="/login" className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-xl shadow-blue-500/20 flex justify-center items-center gap-2 transform hover:-translate-y-1 transition-transform">
                                Enroll Now <ArrowRight size={20} />
                            </Link>
                            <a href="#courses" className="btn btn-outline text-lg px-8 py-4 rounded-full border-2 hover:bg-slate-50 text-center">
                                Explore Courses
                            </a>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 lg:gap-8 text-slate-500 text-sm font-semibold">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" /> 100% Scholarship
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" /> Expert Faculty
                            </div>
                        </div>
                    </div>

                    {/* Hero Graphic */}
                    <div className="relative order-1 lg:order-2">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-3xl transform rotate-6"></div>
                        <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-2xl p-2 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Students Learning" className="rounded-[1.8rem] w-full object-cover h-[300px] lg:h-[500px]" />
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 -z-0 opacity-50 hidden lg:block"></div>
            </header>

            {/* Features / Why Choose Us */}
            <section id="about" className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Why Choose Kalam Coaching?</h2>
                        <p className="text-slate-600 text-lg">We don't just teach chapters; we build character, discipline, and academic excellence.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="text-blue-600" size={32} />}
                            title="Personalized Mentorship"
                            desc="Small batch sizes ensure every student receives individual attention from our expert faculty to clear doubts instantly."
                        />
                        <FeatureCard
                            icon={<Smartphone className="text-indigo-600" size={32} />}
                            title="Smart App Access"
                            desc="Parents can track marks, attendance, and assignment status in real-time via our dedicated student portal."
                        />
                        <FeatureCard
                            icon={<Award className="text-purple-600" size={32} />}
                            title="Proven Track Record"
                            desc="Consistently producing district toppers and distinction holders for the past 5 years in Board Exams."
                        />
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section id="courses" className="py-16 lg:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-xl">
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Popular Courses</h2>
                            <p className="text-slate-600">Tailored programs to meet specific academic goals.</p>
                        </div>
                        <button className="hidden md:block btn btn-outline rounded-full px-6">View All</button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <CourseCard
                            grade="Class 10"
                            title="Board Excellence Program"
                            desc="Intensive preparation for Math & Science with weekly tests."
                            color="bg-blue-600"
                        />
                        <CourseCard
                            grade="Class 9"
                            title="Foundation Builder"
                            desc="Building strong concepts for upcoming board years."
                            color="bg-indigo-600"
                        />
                        <CourseCard
                            grade="Class 11-12"
                            title="NEET / JEE Prep"
                            desc="Integrated coaching for competitive exams alongside Boards."
                            color="bg-purple-600"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6 lg:mb-8">Ready to start your journey?</h2>
                    <p className="text-slate-400 text-lg lg:text-xl mb-8 lg:mb-10 max-w-2xl mx-auto">
                        Admissions open for the new academic session. Book a free demo class today and experience the difference.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg shadow-blue-600/30 w-full sm:w-auto">
                            Book Demo Class
                        </button>
                    </div>
                </div>
            </section>

            {/* Contact & Footer */}
            <footer id="contact" className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                                <span className="text-xl font-bold text-white tracking-tight">Kalam Coaching</span>
                            </div>
                            <p className="mb-6 leading-relaxed max-w-sm">Empowering students with knowledge and values. Join us to transform your academic journey.</p>
                            <div className="flex gap-4">
                                <SocialIcon icon={<Facebook size={18} />} />
                                <SocialIcon icon={<Twitter size={18} />} />
                                <SocialIcon icon={<Instagram size={18} />} />
                                <SocialIcon icon={<Linkedin size={18} />} />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#courses" className="hover:text-white transition-colors">Courses</a></li>
                                <li><a href="#faculty" className="hover:text-white transition-colors">Faculty</a></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Contact Us</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <MapPin className="text-blue-600 shrink-0" size={20} />
                                    <span>123 Education Lane, Knowledge Park, City Center</span>
                                </li>
                                <li className="flex gap-3">
                                    <Phone className="text-blue-600 shrink-0" size={20} />
                                    <span>+91 98765 43210</span>
                                </li>
                                <li className="flex gap-3">
                                    <Mail className="text-blue-600 shrink-0" size={20} />
                                    <span>admissions@kalamcoaching.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-900 pt-8 text-center text-sm">
                        <p>&copy; 2024 Kalam Coaching Institute. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-slate-100 group">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-blue-600">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
);

const CourseCard = ({ grade, title, desc, color }) => (
    <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
        <div className={`${color} h-40 rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden`}>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
            <span className="font-bold tracking-wider text-xs opacity-75 uppercase">{grade}</span>
            <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="p-6">
            <p className="text-slate-600 mb-4">{desc}</p>
            <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                View Details <ArrowRight size={16} className="ml-1" />
            </div>
        </div>
    </div>
);

const SocialIcon = ({ icon }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-slate-800">
        {icon}
    </a>
)

export default Home;
