import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WebsiteLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        {
            name: 'Home',
            action: () => {
                if (location.pathname !== '/') {
                    navigate('/');
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        },
        { name: 'About Us', action: () => scrollToSection('about') },
        { name: 'Features', action: () => scrollToSection('features') },
        { name: 'Pricing', action: () => scrollToSection('pricing') },
        { name: 'Contact', path: '/contact' },
    ];

    const footerLinks = {
        Products: ['Student Management', 'Academics', 'Finance', 'Communication', 'Library'],
        Company: ['About Us', 'Blog', 'Careers', 'Partners'],
        Resources: ['Documentation', 'Support', 'API Docs', 'Community'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Security'],
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 h-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                            EduSync
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex gap-6">
                            {navLinks.map((link) => (
                                link.path ? (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors hover:text-primary-600 ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-600'}`}
                                    >
                                        {link.name}
                                    </Link>
                                ) : (
                                    <button
                                        key={link.name}
                                        onClick={link.action}
                                        className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                )
                            ))}
                        </div>
                        <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
                            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-primary-600">
                                Log In
                            </Link>
                            <Link
                                to="/contact"
                                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:text-primary-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-4">
                                {navLinks.map((link) => (
                                    link.path ? (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-base font-medium text-slate-600 hover:text-primary-600 py-2"
                                        >
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <button
                                            key={link.name}
                                            onClick={link.action}
                                            className="block w-full text-left text-base font-medium text-slate-600 hover:text-primary-600 py-2"
                                        >
                                            {link.name}
                                        </button>
                                    )
                                ))}
                                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                    <Link
                                        to="/login"
                                        className="w-full py-3 text-center text-slate-700 font-semibold bg-slate-50 rounded-lg"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="w-full py-3 text-center bg-primary-600 text-white font-semibold rounded-lg shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                        <div className="lg:col-span-2">
                            <Link to="/" className="flex items-center gap-2 mb-6 text-white">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="text-white w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold">EduSync</span>
                            </Link>
                            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                                Transforming education management with intelligent, scalable, and secure technology. Trusted by 2,500+ schools worldwide.
                            </p>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors cursor-pointer">
                                        <div className="w-4 h-4 bg-current opacity-50"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h4 className="text-white font-semibold mb-6">{title}</h4>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="hover:text-primary-400 transition-colors text-sm">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>&copy; 2025 EduSync Systems. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
