import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const demoAccounts = [
    { label: 'Super Admin', email: 'superadmin@edusync.com', password: 'Admin@123', color: 'bg-purple-500' },
    { label: 'School Admin', email: 'admin@dps.edu.in', password: 'Admin@123', color: 'bg-primary-500' },
    { label: 'Teacher', email: 'amit.patel@dps.edu.in', password: 'Teacher@123', color: 'bg-amber-500' },
    { label: 'Student', email: 'arjun.m@student.dps.edu.in', password: 'Student@123', color: 'bg-accent-500' },
    { label: 'Parent', email: 'parent.arjun.m@student.dps.edu.in', password: 'Parent@123', color: 'bg-cyan-500' },
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome, ${user.name}!`);

            // Redirect based on role
            switch (user.role) {
                case 'superadmin':
                    navigate('/superadmin');
                    break;
                case 'schooladmin':
                    navigate('/schooladmin'); // Corrected from /admin based on App.jsx
                    break;
                case 'teacher':
                    navigate('/teacher');
                    break;
                case 'student':
                    navigate('/student');
                    break;
                case 'parent':
                    navigate('/parent');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = (account) => { setEmail(account.email); setPassword(account.password); };

    return (
        <div className="min-h-screen flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 text-white max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <GraduationCap size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">EduSync</h1>
                            <p className="text-white/70 text-sm">School Management System</p>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold leading-tight mb-4">India's Most Trusted School ERP Solution</h2>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                        A comprehensive, cloud-based platform managing admissions, academics, finance, communication, library, transport — everything your school needs.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {['Multi-Tenant SaaS', 'Role-Based Access', 'Real-Time Analytics', 'Cross-Platform'].map((f) => (
                            <div key={f} className="flex items-center gap-2 text-white/90">
                                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                <span className="text-sm font-medium">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-surface-50">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-surface-500 hover:text-primary-600 font-medium transition-colors mb-6 group">
                            <span className="w-8 h-8 rounded-full bg-white border border-surface-200 flex items-center justify-center group-hover:border-primary-200 group-hover:bg-primary-50 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                            </span>
                            Back to Home
                        </button>

                        <div className="lg:hidden flex items-center gap-3">
                            <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center">
                                <GraduationCap size={24} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gradient">EduSync</h1>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-surface-900 mb-1">Welcome Back</h2>
                    <p className="text-surface-500 mb-8">Sign in to continue to your dashboard</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@school.edu.in"
                                className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all pr-11" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all">
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo Quick Login */}
                    <div className="mt-8">
                        <p className="text-xs text-surface-400 text-center mb-3 font-medium uppercase tracking-wider">Demo Accounts — Quick Login</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {demoAccounts.map((acc) => (
                                <button key={acc.label} onClick={() => quickLogin(acc)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 hover:border-primary-300 transition-all text-xs font-medium text-surface-600 hover:text-primary-600">
                                    <span className={`w-2 h-2 rounded-full ${acc.color}`}></span>
                                    {acc.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
