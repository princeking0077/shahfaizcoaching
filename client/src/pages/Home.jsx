import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="p-6 flex justify-between items-center container">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Kalam Coaching
                </h1>
                <Link to="/login" className="btn btn-primary">
                    Login Portal
                </Link>
            </nav>

            {/* Hero Section */}
            <header className="container min-h-[80vh] flex flex-col justify-center items-center text-center animate-fade-in relative z-10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <h2 className="text-6xl font-bold mb-6 leading-tight">
                    Igniting Minds, <br />
                    <span className="text-yellow-400">Shaping Futures.</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mb-8">
                    Premium coaching for Class 1 to 10. We nurture talent with world-class personalized education and detailed performance analytics.
                </p>
                <Link to="/login" className="btn btn-primary text-lg flex items-center gap-2">
                    Get Started <ArrowRight size={20} />
                </Link>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-gray-900/50">
                <div className="container grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Users className="text-yellow-400" size={32} />}
                        title="Expert Faculty"
                        desc="Learn from the best educators in the country with personalized attention."
                    />
                    <FeatureCard
                        icon={<BookOpen className="text-yellow-400" size={32} />}
                        title="Comprehensive Material"
                        desc="Curated study materials aligned with the latest curriculum."
                    />
                    <FeatureCard
                        icon={<Award className="text-yellow-400" size={32} />}
                        title="Performance Tracking"
                        desc="Real-time attendance and marks analysis for parents and students."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card hover:scale-105 transition-transform duration-300">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{desc}</p>
    </div>
);

export default Home;
