import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

const Customers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState({
        username: '',
        email: '',
        plans: [],
    });
    const [showExtendForm, setShowExtendForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:1337/users');
                setUsers(response.data.users || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleEditUser = (user) => {
        setSelectedUser(user._id);
        setForm({
            username: user.username,
            email: user.email,
            plans: user.plans,
        });
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.put(`http://localhost:1337/users/${selectedUser}`, form);
            const updatedUsers = users.map((user) =>
                user._id === selectedUser ? response.data : user
            );
            setUsers(updatedUsers);
            setSelectedUser(null);
            setForm({
                username: '',
                email: '',
                plans: [],
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:1337/users/${userId}`);
                setUsers(users.filter((user) => user._id !== userId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleExtendPlan = (plan) => {
        setSelectedPlan(plan);
        setShowExtendForm(true);
    };

    const handleTerminatePlan = async (userId, planId) => {
        if (window.confirm('Are you sure you want to terminate this plan?')) {
            try {
                await axios.post(`http://localhost:1337/user/remove-plan`, { userId, planId });
                const updatedUsers = users.map((user) => {
                    if (user._id === userId) {
                        user.plans = user.plans.filter((plan) => plan._id !== planId);
                    }
                    return user;
                });
                setUsers(updatedUsers);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleExtendPlanSubmit = async (newDuration) => {
        // Logic to extend the plan duration
        // You would need to implement the API and logic to update the plan duration
        setShowExtendForm(false);
        setSelectedPlan(null);
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center">
                <table className="min-w-full text-gray-700 mb-10">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">User ID</th>
                            <th className="py-2 px-4">Username</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Plans</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="py-2 px-4">{user._id}</td>
                                <td className="py-2 px-4">{user.username}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">
                                    {user.plans.map((plan) => (
                                        <div key={plan._id} className="mb-2">
                                            <p>Server: {plan.serverName}</p>
                                            <p>Duration: {plan.duration} days</p>
                                            <p>Status: {plan.status}</p>
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => handleExtendPlan(plan)}
                                            >
                                                Extend
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleTerminatePlan(user._id, plan._id)}
                                            >
                                                Terminate
                                            </button>
                                        </div>
                                    ))}
                                </td>
                                <td className="flex space-x-2 py-2 px-4">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedUser && (
                    <div className="w-full max-w-3xl">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-4">
                            <div className="mb-4 col-span-2 sm:col-span-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4 col-span-2 sm:col-span-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <h3 className="text-lg font-bold mb-2">Plans</h3>
                                {form.plans.map((plan, index) => (
                                    <div key={index} className="mb-2">
                                        <p>Server: {plan.serverName}</p>
                                        <p>Duration: {plan.duration} days</p>
                                        <p>Status: {plan.status}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between col-span-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleUpdateUser}
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {showExtendForm && selectedPlan && (
                    <div className="w-full max-w-3xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-xl font-bold mb-4">Extend Plan</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const newDuration = e.target.duration.value;
                                handleExtendPlanSubmit(newDuration);
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serverName">
                                    Server
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="serverName"
                                    name="serverName"
                                    type="text"
                                    value={selectedPlan.serverName}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentDuration">
                                    Current Duration
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="currentDuration"
                                    name="currentDuration"
                                    type="text"
                                    value={`${selectedPlan.duration} days`}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newDuration">
                                    New Duration (in days)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="newDuration"
                                    name="duration"
                                    type="number"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Extend Plan
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={() => setShowExtendForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers;
