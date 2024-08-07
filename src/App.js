import React, { useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import VPNPlans from './pages/components/Products/VPNPlans';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { useAuth } from './AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

const DiscordCallback = () => {
  const { setUser, setLoading } = useAuth();
  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async (token) => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await fetch('http://localhost:1337/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.status === 'success') {
        setUser(data.user);
        navigate('/profile');
      } else {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      localStorage.removeItem('token');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, setUser]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      fetchUserDetails(token);
    } else {
      navigate('/');
    }
  }, [navigate, fetchUserDetails]);

  return (
    <div className="flex justify-center items-center bg-slate-900">
      <div className="w-16 h-16 border-4 border-indigo-500 border-dotted rounded-full animate-spin"></div>
    </div>
  );
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/products" element={<VPNPlans />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth/discord/callback" element={<DiscordCallback />} />
      </Routes>
    </>
  );
}

export default App;
