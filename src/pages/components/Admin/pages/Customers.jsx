import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../index.css' // Make sure to import the CSS file where the custom class is defined

const Customers = () => {
    const [users, setUsers] = useState([]);
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState({
        username: '',
        email: '',
        plans: [],
    });
    const [showExtendForm, setShowExtendForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [expandedPlans, setExpandedPlans] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:1337/users');
                setUsers(response.data.users || []);
            } catch (err) {
                toast.error(err.message, {
                    className: 'custom-toast',
                });
            }
        };

        const fetchServers = async () => {
            try {
                const response = await axios.get('http://localhost:1337/servers');
                setServers(response.data.servers || []);
            } catch (err) {
                toast.error(err.message, {
                    className: 'custom-toast',
                });
            }
        };

        const fetchData = async () => {
            await Promise.all([fetchUsers(), fetchServers()]);
            setLoading(false);
        };

        fetchData();
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
            await axios.put(`http://localhost:1337/user/${selectedUser}`, form);
            const updatedUsers = users.map((user) =>
                user._id === selectedUser ? { ...user, ...form } : user
            );
            setUsers(updatedUsers);
            setSelectedUser(null);
            setForm({
                username: '',
                email: '',
                plans: [],
            });
        } catch (err) {
            toast.error(err.message, {
                className: 'custom-toast',
            });
        }
    };

    const handleDeleteUser = (userId) => {
        toast(
            ({ closeToast }) => (
                <div>
                    Are you sure you want to delete this user?
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    await axios.delete(`http://localhost:1337/user/${userId}`);
                                    setUsers(users.filter((user) => user._id !== userId));
                                    closeToast();
                                } catch (err) {
                                    toast.error(err.message, {
                                        className: 'custom-toast',
                                    });
                                }
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Yes
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-indigo-500 text-white px-4 py-2 rounded ml-2"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                closeButton: false,
                className: 'custom-toast',
            }
        );
    };

    const handleExtendPlan = (plan) => {
        setSelectedPlan(plan);
        setShowExtendForm(true);
    };

    const handleTerminatePlan = (userId, planId) => {
        toast(
            ({ closeToast }) => (
                <div>
                    Are you sure you want to terminate this plan?
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    await axios.post('http://localhost:1337/user/remove-plan', { userId, serverId: planId });
                                    const updatedUsers = users.map((user) => {
                                        if (user._id === userId) {
                                            user.plans = user.plans.map((plan) =>
                                                plan._id === planId ? { ...plan, status: 'inactive' } : plan
                                            );
                                        }
                                        return user;
                                    });
                                    setUsers(updatedUsers);
                                    closeToast();
                                } catch (err) {
                                    toast.error(err.message, {
                                        className: 'custom-toast',
                                    });
                                }
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Yes
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-indigo-500 text-white px-4 py-2 rounded ml-2"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                closeButton: false,
                className: 'custom-toast',
            }
        );
    };

    const handleExtendPlanSubmit = async (e) => {
        e.preventDefault();
        const newDuration = e.target.newDuration.value;
        try {
            await axios.post('http://localhost:1337/user/update-plan', {
                userId: selectedUser,
                serverId: selectedPlan.serverId,
                duration: newDuration,
                serverName: selectedPlan.serverName,
                transaction: {
                    userId: selectedUser,
                    serverId: selectedPlan.serverId,
                    duration: newDuration,
                    planDetails: selectedPlan,
                    price: selectedPlan.price,
                },
            });
            setShowExtendForm(false);
            setSelectedPlan(null);
        } catch (err) {
            toast.error(err.message, {
                className: 'custom-toast',
            });
        }
    };

    const togglePlanDetails = (planId) => {
        setExpandedPlans({
            ...expandedPlans,
            [planId]: !expandedPlans[planId],
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-slate-900">
                <div className="w-16 h-16 border-4 border-indigo-500 border-dotted rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className='bg-slate-900 h-screen text-neutral-100'>
            <Header />
            <ToastContainer />
            <div className="flex flex-col items-center">
                <table className="min-w-full text-neutral-100 mb-10">
                    <thead>
                        <tr className="bg-slate-700">
                            <th className="py-2 px-4">User ID</th>
                            <th className="py-2 px-4">Username</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Plans</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-800">
                                <td className="py-2 px-4">{user._id}</td>
                                <td className="py-2 px-4">{user.username}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">
                                    <div className="flex flex-wrap gap-2">
                                        {user.plans.map((plan) => {
                                            const server = servers.find((server) => server._id === plan.serverId);
                                            const flagUrl = server ? server.flagUrl : 'https://via.placeholder.com/48';

                                            return (
                                                <div key={plan._id} className="mb-2 flex flex-col items-center">
                                                    <img
                                                        src={flagUrl}
                                                        alt={plan.serverName}
                                                        className="w-12 h-12 rounded-md cursor-pointer"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/48'; // Placeholder image on error
                                                        }}
                                                        onClick={() => togglePlanDetails(plan._id)}
                                                    />
                                                    {expandedPlans[plan._id] && (
                                                        <div className="mt-2 text-center">
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
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className="space-x-2 px-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-1 rounded"
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
                        <div>
                            <label className="block mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleInputChange}
                                className="border rounded p-2 mb-4 w-full bg-slate-700"
                            />
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                                className="border rounded p-2 mb-4 w-full bg-slate-700"
                            />
                            <button
                                onClick={handleUpdateUser}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Update User
                            </button>
                        </div>
                    </div>
                )}

                {showExtendForm && (
                    <form onSubmit={handleExtendPlanSubmit} className="mt-4 max-w-xl">
                        <h3 className="text-lg font-semibold mb-4">Extend Plan for {selectedPlan.serverName}</h3>
                        <label className="block mb-2">New Duration (days)</label>
                        <input
                            type="number"
                            name="newDuration"
                            className="border rounded p-2 mb-4 w-full bg-slate-700 text-neutral-100"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Extend Plan
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Customers;
