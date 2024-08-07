import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Sidebar, { SideBarItem } from './components/Profile/Sidebar';
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineShoppingCart, HiOutlineCog, HiOutlineQuestionMarkCircle, HiOutlineLogout, HiOutlineHome } from 'react-icons/hi';
import PageLayout from './components/Profile/PageLayout'; // Ensure you have a PageLayout component

const Profile = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, setIsLoggedIn, userDetails, setUserDetails } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUserDetails = useCallback(async (token) => {
        const response = await fetch('http://localhost:1337/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.status === 'success') {
            setIsLoggedIn(true);
            setUserDetails(data.user);
            setLoading(false);
        } else {
            localStorage.removeItem('token');
            navigate('/');
        }
    }, [navigate, setIsLoggedIn, setUserDetails]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            fetchUserDetails(token);
        }

        // Get the page from query parameters
        const queryParams = new URLSearchParams(location.search);
        const page = queryParams.get('page');
        if (page) {
            setActivePage(page);
            navigate(location.pathname, { replace: true }); // Remove the query parameter from the URL
        }
    }, [location, navigate, fetchUserDetails]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserDetails(null);
        navigate('/');
    };

    const handlePageClick = (page) => {
        setActivePage(page);
        navigate(`/profile?page=${page}`, { replace: true });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-slate-900">
                <div className="w-16 h-16 border-4 border-indigo-500 border-dotted rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        navigate('/auth/login'); // or a redirect to login page
    }

    return (
        <div className='flex flex-row w-screen h-screen bg-slate-900 overflow-hidden'>
            <Sidebar userInfo={userDetails}>
                <SideBarItem
                    onClick={() => navigate('/')}
                    icon={<HiOutlineHome size={20} />}
                    active={activePage === null}
                    text="Home"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Dashboard')}
                    icon={<HiOutlineViewGrid size={20} />}
                    active={activePage === 'Dashboard'}
                    text="Dashboard"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Services')}
                    icon={<HiOutlineCube size={20} />}
                    active={activePage === 'Services'}
                    text="Services"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Products')}
                    icon={<HiOutlineShoppingCart size={20} />}
                    active={activePage === 'Products'}
                    text="Products"
                />
                <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-200'>
                    <SideBarItem
                        onClick={() => handlePageClick('Settings')}
                        icon={<HiOutlineCog size={20} />}
                        active={activePage === 'Settings'}
                        text="Settings"
                    />
                    <SideBarItem
                        onClick={() => handlePageClick('Help')}
                        icon={<HiOutlineQuestionMarkCircle size={20} />}
                        active={activePage === 'Help'}
                        text="Help & Support"
                    />
                    <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-200'>
                        <SideBarItem
                            onClick={() => handleLogout()}
                            icon={<HiOutlineLogout size={20} />}
                            active={activePage === 'Logout'}
                            text="Logout"
                        />
                    </div>
                </div>
            </Sidebar>
            <div className='flex-1 overflow-auto'>
                <PageLayout page={activePage} />
            </div>
        </div>
    );
};

export default Profile;