/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const res = await apiClient.get('/users/me');
                    console.log('✅ User loaded from token:', res);
                    console.log('👤 User role:', res?.role);
                    setUser(res);
                } catch (err) {
                    console.error('❌ Failed to load user from token:', err.message);
                    localStorage.removeItem('token');
                    delete apiClient.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const res = await apiClient.post('/users/login', { email, password });
        console.log('🔐 Login response:', res);
        console.log('👤 Logged in user:', res.user);
        console.log('🎭 User role:', res.user?.role);
        localStorage.setItem('token', res.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
        setUser(res.user);
        return res.user;
    };

    const register = async (name, email, password) => {
        const res = await apiClient.post('/users/register', { name, email, password });
        localStorage.setItem('token', res.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
        setUser(res.user);
        return res.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
