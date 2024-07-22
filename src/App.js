import React, { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import VPNPlans from './pages/components/Products/VPNPlans';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

const DiscordCallback = () => {
  const { setUser, setLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      fetchUserDetails(token);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUserDetails = async (token) => {
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
      setLoading(false); // Set loading to false after fetch completes
    }
  };

  return <div>Loading...</div>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<VPNPlans />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/auth/discord/callback" element={<DiscordCallback />} />
    </Routes>
  );
}

export default App;
