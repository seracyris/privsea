import React, { useState, useEffect } from 'react';

const Services = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [user, setUser] = useState(null); // Add state for user

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
                    setUser(data.user);
                    setPlans(data.user.plans);
                } catch (error) {
                    console.error('Error fetching user plans:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPlans();
    }, []);

    const handleCancelClick = (plan) => {
        setSelectedPlan(plan);
    };

    const handleConfirmCancel = async () => {
        if (selectedPlan && user) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:1337/user/remove-plan', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            userId: user._id, // Use the user ID from state
                            serverId: selectedPlan.serverId,
                            duration: selectedPlan.duration,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to remove plan');
                    }
                    const data = await response.json();
                    setPlans(data.user.plans);
                    setSelectedPlan(null);
                } catch (error) {
                    console.error('Error removing plan:', error);
                    setError(error.message);
                }
            }
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Plans</h1>
            {plans.length > 0 ? (
                <table className="min-w-full bg-white mb-8">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Server Name</th>
                            <th className="py-2 px-4 border-b">Duration (days)</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Action</th>
                            <th className="py-2 px-4 border-b">Download Config</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{plan.serverName}</td>
                                <td className="py-2 px-4 border-b">{plan.duration}</td>
                                <td className="py-2 px-4 border-b">{plan.status}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleCancelClick(plan)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <a
                                        href={`/path/to/configs/${plan.serverId}.ovpn`}
                                        className="text-blue-500"
                                        download
                                    >
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="min-w-full bg-white mb-8">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Server Name</th>
                            <th className="py-2 px-4 border-b">Duration (days)</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Download Config</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-4 border-b" colSpan="4">No plans available</td>
                        </tr>
                    </tbody>
                </table>
            )}

            {selectedPlan && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Cancel Plan</h2>
                        <p className="mb-4">
                            Are you sure you want to cancel? This will not refund you, only prevent further charges, and you will lose access immediately.
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                onClick={() => setSelectedPlan(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleConfirmCancel}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
