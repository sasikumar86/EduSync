import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Chatbot from '../components/Chatbot';
import {
    LayoutDashboard, Users, UserCog, GraduationCap, BookOpen, Calendar,
    ClipboardList, DollarSign, Bus, Bell, Library, School, Menu, X,
    LogOut, ChevronDown, MessageCircle, FileText
} from 'lucide-react';

const navConfig = {
    superadmin: [
        { to: '/superadmin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/superadmin/schools', icon: School, label: 'Schools' },
    ],
    schooladmin: [
        { to: '/schooladmin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/schooladmin/students', icon: Users, label: 'Students' },
        { to: '/schooladmin/staff', icon: UserCog, label: 'Staff' },
        { to: '/schooladmin/classes', icon: GraduationCap, label: 'Classes' },
        { to: '/schooladmin/attendance', icon: ClipboardList, label: 'Attendance' },
        { to: '/schooladmin/exams', icon: FileText, label: 'Exams' },
        { to: '/schooladmin/results', icon: BookOpen, label: 'Results' },
        { to: '/schooladmin/fees', icon: DollarSign, label: 'Fees' },
        { to: '/schooladmin/library', icon: Library, label: 'Library' },
        { to: '/schooladmin/transport', icon: Bus, label: 'Transport' },
        { to: '/schooladmin/notifications', icon: Bell, label: 'Notifications' },
    ],
    teacher: [
        { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/teacher/attendance', icon: ClipboardList, label: 'Attendance' },
        { to: '/teacher/results', icon: BookOpen, label: 'Results' },
        { to: '/teacher/library', icon: Library, label: 'Library' },
    ],
    student: [
        { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/student/library', icon: Library, label: 'Digital Library' },
    ],
    parent: [
        { to: '/parent', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
};

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navItems = navConfig[user?.role] || [];

    const handleLogout = () => { logout(); navigate('/login'); };

    const roleLabel = { superadmin: 'Super Admin', schooladmin: 'School Admin', teacher: 'Teacher', student: 'Student', parent: 'Parent' };
    const roleColor = { superadmin: 'bg-purple-500', schooladmin: 'bg-primary-500', teacher: 'bg-amber-500', student: 'bg-accent-500', parent: 'bg-cyan-500' };

    return (
        <div className="flex h-screen bg-surface-100">
            {/* Sidebar Overlay (mobile) */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 gradient-dark text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center font-bold text-lg">E</div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">EduSync</h1>
                        <p className="text-xs text-surface-400">School Management</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1 hover:bg-white/10 rounded"><X size={20} /></button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-white/15 text-white shadow-lg shadow-white/5' : 'text-surface-300 hover:bg-white/8 hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${roleColor[user?.role]} flex items-center justify-center text-white font-semibold text-sm`}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-surface-400">{roleLabel[user?.role]}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 glass border-b border-surface-200 flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-50">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-surface-100 rounded-xl"><Menu size={22} /></button>
                        <div>
                            <h2 className="font-semibold text-surface-900 text-sm lg:text-base">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                            <p className="text-xs text-surface-500 hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setChatOpen(!chatOpen)} className="p-2 hover:bg-primary-50 text-surface-500 hover:text-primary-600 rounded-xl transition-all relative" title="Chat Assistant">
                            <MessageCircle size={22} />
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button onClick={() => navigate(user?.role === 'superadmin' ? '/superadmin' : `/${user?.role}`)} className="p-2 hover:bg-surface-100 text-surface-500 rounded-xl"><Bell size={22} /></button>
                        <div className="relative">
                            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 hover:bg-surface-100 rounded-xl">
                                <div className={`w-8 h-8 rounded-full ${roleColor[user?.role]} flex items-center justify-center text-white text-sm font-semibold`}>
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <ChevronDown size={16} className="text-surface-400 hidden sm:block" />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-glass border border-surface-200 py-2 z-50 animate-slide-up">
                                    <div className="px-4 py-2 border-b border-surface-100">
                                        <p className="text-sm font-medium">{user?.name}</p>
                                        <p className="text-xs text-surface-400">{user?.email}</p>
                                    </div>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        <LogOut size={16} /><span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Chatbot */}
            <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}
