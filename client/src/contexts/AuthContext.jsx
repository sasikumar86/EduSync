import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('edusync_token');
        const savedUser = localStorage.getItem('edusync_user');
        if (token && savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch { localStorage.clear(); }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
            localStorage.setItem('edusync_token', data.token);
            localStorage.setItem('edusync_user', JSON.stringify(data.user));
            setUser(data.user);
            return data.user;
        }
        throw new Error(data.message || 'Login failed');
    };

    const logout = () => {
        localStorage.removeItem('edusync_token');
        localStorage.removeItem('edusync_user');
        setUser(null);
    };

    const value = { user, login, logout, loading, isAuthenticated: !!user };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
