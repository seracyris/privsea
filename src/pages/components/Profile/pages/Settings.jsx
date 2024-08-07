import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
    const [user, setUser] = useState({});
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const token = localStorage.getItem('token'); // Assuming token is stored in local storage

    useEffect(() => {
        // Fetch user data from your backend
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:1337/user', { // Ensure the endpoint matches your backend
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('User data fetched successfully:', response.data); // Log successful response
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
                toast.error('Error fetching user data');
            }
        };

        fetchUserData();
    }, [token]);

    const handleProfilePictureChange = async () => {
        if (!newProfilePicture) return;

        const formData = new FormData();
        formData.append('profilePicture', newProfilePicture);

        try {
            const response = await axios.put('http://localhost:1337/api/user/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Profile picture updated successfully:', response.data); // Log successful response
            setUser(response.data.user);
            toast.success('Profile picture updated successfully');
        } catch (error) {
            console.error('Error updating profile picture:', error.response ? error.response.data : error.message);
            toast.error('Error updating profile picture');
        }
    };

    const handleConnectDiscord = () => {
        window.location.href = `http://localhost:1337/auth/discord`; // Redirect to your backend Discord auth route
    };

    return (
        <div className="container mx-auto p-4 text-neutral-100">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-slate-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border bg-slate-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        value={user.username || ''}
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border bg-slate-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        value={user.email || ''}
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="discordId">
                        Discord ID
                    </label>
                    <input
                        className="shadow appearance-none border bg-slate-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="discordId"
                        type="text"
                        value={user.discordId || ''}
                        readOnly
                    />
                    {!user.discordId && (
                        <button
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                            onClick={handleConnectDiscord}
                        >
                            Connect Discord
                        </button>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="profilePicture">
                        Profile Picture
                    </label>
                    <input
                        className="shadow appearance-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="profilePicture"
                        type="file"
                        onChange={(e) => setNewProfilePicture(e.target.files[0])}
                    />
                    <button
                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                        onClick={handleProfilePictureChange}
                    >
                        Update Profile Picture
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
