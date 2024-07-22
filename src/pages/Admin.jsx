import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { SideBarItem } from '../pages/components/Admin/Sidebar';
import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineAnnotation,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog,
    HiOutlineLogout
} from 'react-icons/hi';
import PageLayout from '../pages/components/Admin/PageLayout';
import AdminError from '../pages/components/Admin/AdminError';
import { useAuth } from '../AuthContext';

const Admin = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const { isLoggedIn, setIsLoggedIn, userDetails, setUserDetails } = useAuth();
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await fetch('http://localhost:1337/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    navigate('/');
                    return;
                }

                const data = await response.json();
                if (data.status === 'success') {
                    setUserDetails(data.user);
                    setIsAdmin(data.user.userType === 'admin');
                } else {
                    navigate('/');
                }
            } catch (error) {
                navigate('/');
            }
        };

        fetchUserInfo();
    }, [navigate, setUserDetails]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserDetails(null);
        navigate('/');
    };

    const handlePageClick = (pageName) => {
        setActivePage(pageName);
    };

    if (isAdmin === null) {
        return <div>Loading...</div>; // or a loading indicator
    }

    if (!isAdmin) {
        return <AdminError />;
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
                    onClick={() => handlePageClick('Products')}
                    icon={<HiOutlineCube size={20} />}
                    active={activePage === 'Products'}
                    text="Products"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Orders')}
                    icon={<HiOutlineShoppingCart size={20} />}
                    active={activePage === 'Orders'}
                    text="Orders"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Customers')}
                    icon={<HiOutlineUsers size={20} />}
                    active={activePage === 'Customers'}
                    text="Customers"
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
                    <SideBarItem
                        onClick={() => handleLogout()}
                        icon={<HiOutlineLogout size={20} />}
                        text="Logout"
                    />
                </div>
            </Sidebar>
            <div className='flex-1 overflow-auto'>
                <PageLayout page={activePage} />
            </div>
        </div>
    );
};

export default Admin;
