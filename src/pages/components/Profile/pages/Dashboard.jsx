import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VPNPlans from '../../Products/VPNPlans';

const Dashboard = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    const serverConfigMap = {
        'Oregon': 'or-privsea.ovpn',
        'Virginia': 'va-privsea.ovpn',
        'London': 'uk-privsea.ovpn'
    };

    useEffect(() => {
        const fetchPlans = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:1337/user', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user details');
                    }
                    const data = await response.json();
                    setPlans(data.user.plans);
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPlans();

        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:1337/transactions', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch transactions');
                    }
                    const data = await response.json();
                    setTransactions(data.transactions);
                } catch (error) {
                    toast.error(error.message);
                }
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-slate-900">
                <div className="w-16 h-16 border-4 border-indigo-500 border-dotted rounded-full animate-spin"></div>
            </div>
        );
    }

    // Conditionally render VPNPlans if no plans or transactions are found
    if (plans.length === 0 && transactions.length === 0) {
        return <VPNPlans />;
    }

    const getPlanStatus = (serverId, duration) => {
        const plan = plans.find(plan => plan.serverId === serverId && plan.duration === duration);
        return plan ? plan.status : 'unknown';
    };

    return (
        <div className='flex flex-col items-center bg-slate-900 min-h-screen py-10 px-5 text-neutral-100'>
            <ToastContainer />
            <div className="container mx-auto p-10 bg-slate-700 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                {plans.length > 0 && (
                    <table className="min-w-full bg-slate-700 mb-8">
                        <thead className='bg-slate-700'>
                            <tr>
                                <th className="py-2 px-4 border-b">Server Name</th>
                                <th className="py-2 px-4 border-b">Duration (days)</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Download Config</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{plan.serverName}</td>
                                    <td className="py-2 px-4 border-b">{plan.duration}</td>
                                    <td className={clsx('py-2 px-4 border-b', plan.status === 'active' ? 'text-green-400' : 'text-red-400')}>{plan.status}</td>
                                    <td className="py-2 px-4 border-b">
                                        {plan.status === 'active' ? (
                                            <a
                                                href={`${process.env.PUBLIC_URL}/openvpn-configs/${serverConfigMap[plan.serverName]}`}
                                                className="text-blue-500"
                                                download
                                            >
                                                Download
                                            </a>
                                        ) : (
                                            <span className="text-red-400"></span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {transactions.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold my-4">Transactions</h2>
                        <table className="min-w-full bg-slate-700 mb-8">
                            <thead className='bg-slate-700'>
                                <tr>
                                    <th className="py-2 px-4 border-b">Transaction ID</th>
                                    <th className="py-2 px-4 border-b">Server Name</th>
                                    <th className="py-2 px-4 border-b">Duration</th>
                                    <th className="py-2 px-4 border-b">Amount</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                    <th className="py-2 px-4 border-b">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => {
                                    const status = getPlanStatus(transaction.serverId, transaction.planDetails.duration);
                                    return (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b">{transaction._id}</td>
                                            <td className="py-2 px-4 border-b">{transaction.planDetails.serverName}</td>
                                            <td className="py-2 px-4 border-b">{transaction.planDetails.duration}</td>
                                            <td className="py-2 px-4 border-b">${transaction.price}</td>
                                            <td className={clsx('py-2 px-4 border-b', status === 'active' ? 'text-green-400' : 'text-red-400')}>{status}</td>
                                            <td className="py-2 px-4 border-b">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;