import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Sidebar, { SideBarItem } from './components/Profile/Sidebar';
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineShoppingCart, HiOutlineDocumentText, HiOutlineAnnotation, HiOutlineCog, HiOutlineQuestionMarkCircle, HiOutlineLogout } from 'react-icons/hi';
import PageLayout from './components/Profile/PageLayout'; // Ensure you have a PageLayout component

const Profile = () => {
    const [user, setUser] = useState(null);
    const [activePage, setActivePage] = useState('Dashboard');
    const { isLoggedIn, setIsLoggedIn, userDetails, setUserDetails } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            fetchUserDetails(token);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserDetails(null);
        navigate('/');
    };

    async function fetchUserDetails(token) {
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
            setIsLoggedIn(true);
            setUserDetails(data.user);
        } else {
            localStorage.removeItem('token');
            navigate('/');
        }
    }

    const handlePageClick = (page) => {
        setActivePage(page);
    };

    if (!isLoggedIn) {
        return null; // or a loading spinner
    }

    return (
        <div className='flex flex-row w-screen h-screen bg-neutral-100 overflow-hidden'>
            <Sidebar userInfo={userDetails}>
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
                <SideBarItem
                    onClick={() => handlePageClick('Transactions')}
                    icon={<HiOutlineDocumentText size={20} />}
                    active={activePage === 'Transactions'}
                    text="Transactions"
                    alert
                />
                <SideBarItem
                    onClick={() => handlePageClick('Messages')}
                    icon={<HiOutlineAnnotation size={20} />}
                    active={activePage === 'Messages'}
                    text="Messages"
                />
                <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-700'>
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
                    <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-700'>
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
