import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login({ username, password });

            if (response.success) {
                const { user: userData, token: authToken } = response.data;

                setUser(userData);
                setToken(authToken);

                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', authToken);

                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: 'An error occurred during login' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);

            if (response.success) {
                // All users require approval, so never auto-login
                return {
                    success: true,
                    requiresApproval: true,
                    message: response.data.message || 'Registration successful. Please wait for admin approval.'
                };
            }

            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: 'An error occurred during registration' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const isRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager',
        isFan: user?.role === 'fan',
        isRole,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
