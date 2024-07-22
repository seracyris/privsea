// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUser(decoded);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Failed to decode token:', error);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
        setUserDetails(null);
    };

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            const response = await fetch('http://localhost:1337/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch user details');
            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, userDetails, setUserDetails, login, logout, fetchUserDetails, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
