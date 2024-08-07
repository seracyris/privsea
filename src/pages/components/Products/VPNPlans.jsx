import React, { useState, useEffect, Fragment } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import { FaCheck, FaChevronDown } from "react-icons/fa";
import clsx from 'clsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckIcon } from '@heroicons/react/solid';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_51PeAYLBHxmLuJS3wvISfgVXLjYWLqQrKxhqFnP3ZRDxAsTtvAcsW6Dvz1bmqw3vUVMI05b7beUxbUyC4ZszGZYKx00wawJMuzU');

// Helper function to convert duration to days
const durationToDays = (duration) => {
    const match = duration.match(/^(\d+)\s*(month|months|day|days|year|years)$/i);
    if (!match) return null;

    const number = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
        case 'day':
        case 'days':
            return number;
        case 'month':
        case 'months':
            return number * 30; // Assuming 30 days in a month
        case 'year':
        case 'years':
            return number * 365; // Assuming 365 days in a year
        default:
            return null;
    }
};

// CheckoutForm Component
const CheckoutForm = ({ clientSecret, userId, serverId, duration, serverName, price }) => {
    const fetchClientSecret = () => {
        return fetch("http://localhost:1337/create-checkout-session", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: '{{PRICE_ID}}', // Use actual priceId from your plan
                userId: userId,
                serverId: serverId,
                duration: durationToDays(duration),
            })
        })
            .then((res) => res.json())
            .then((data) => data.clientSecret);
    };

    const options = { fetchClientSecret };

    return (
        <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>{serverName} OVH</span>
            <div>
                <p className='text-6xl font-bold py-4 flex'>{price}<span className='text-xl text-slate-500 flex flex-col justify-end'>/{duration[0]}mo</span></p>
            </div>
            <div className='text-2xl'>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />OpenVPN Config</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />10GB Port Speed</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />DDoS Protection</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Game Firewalls</p>
                <div id="checkout">
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={options}
                    >
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                </div>
            </div>
        </div>
    );
};

// ServerUptime Component
const ServerUptime = () => {
    const [uptimeData, setUptimeData] = useState([]);
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const res = await fetch('http://localhost:1337/servers');
                if (!res.ok) {
                    throw new Error('Failed to fetch servers');
                }
                const data = await res.json();
                setServers(data.servers);
                console.log('Fetched servers:', data.servers);
            } catch (err) {
                console.error('Error fetching servers:', err);
                setError('Failed to fetch servers.');
            }
        };

        const fetchUptime = async () => {
            try {
                const res = await fetch('http://localhost:1337/server-uptime');
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setUptimeData(data.uptimes);
                console.log('Fetched server uptime:', data.uptimes);
            } catch (err) {
                console.error('Error fetching server uptime:', err);
                setError('Failed to fetch server uptime.');
            } finally {
                setLoading(false);
            }
        };

        fetchServers();
        fetchUptime();
    }, []);

    const normalizeName = (name) => {
        return name.trim().toLowerCase();
    };

    const getServerFlagUrl = (name) => {
        const normalizedName = normalizeName(name);
        console.log(`Normalized name: ${normalizedName}`);
        const server = servers.find(server => normalizeName(server.name) === normalizedName);
        console.log(`Finding flag for ${name}:`, server);
        return server ? server.flagUrl : 'https://example.com/default-flag.png';
    };

    return (
        <div className='bg-none text-neutral-200 m-4 p-8 rounded-xl shadow-2xl relative'>
            <h2 className='text-xl font-semibold text-neutral-200 mb-4'>Server Uptime</h2>
            {error && <p className='text-red-500'>{error}</p>}
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-dotted rounded-full animate-spin"></div>
                </div>
            ) : (
                <table className="min-w-full bg-slate-700 mb-8">
                    <thead className='bg-slate-700'>
                        <tr>
                            <th className="py-2 px-4 border-b">Flag</th>
                            <th className="py-2 px-4 border-b">Server Name</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Uptime</th>
                            <th className="py-2 px-4 border-b">CPU Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uptimeData.map((uptime, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">
                                    <img src={getServerFlagUrl(uptime.name)} alt={`${uptime.name} Flag`} className='w-20 rounded-md' />
                                </td>
                                <td className="py-2 px-4 border-b">{uptime.name}</td>
                                <td className="py-2 px-4 border-b">{uptime.location}</td>
                                <td className="py-2 px-4 border-b">{uptime.uptime}</td>
                                <td className="py-2 px-4 border-b">{uptime.cpuUsage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default function VPNPlans() {
    const [servers, setServers] = useState([]);
    const [selectedServerId, setSelectedServerId] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [query, setQuery] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [user, setUser] = useState(null); // Initialize user state
    const [activeTab, setActiveTab] = useState('plans'); // State to manage active tab
    useEffect(() => {
        // Fetch user details from localStorage or some other method
        const fetchUser = async () => {
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
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        fetch('http://localhost:1337/servers')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched servers:', data);
                setServers(data.servers);
            })
            .catch(err => console.error('Error fetching servers:', err));
    }, []);

    const selectedServer = servers.find(server => server._id === selectedServerId);
    const filteredDurations = selectedServer ? selectedServer.plans : [];
    const selectedPlan = selectedServer?.plans.find(plan => plan.duration === selectedDuration);

    useEffect(() => {
        const isValidState = () => {
            return (
                selectedServerId &&
                selectedDuration &&
                selectedPlan &&
                user?._id
            );
        };

        if (isValidState()) {
            console.log('All conditions met, fetching payment intent...');
            const fetchPaymentIntent = async () => {
                try {
                    const response = await fetch("http://localhost:1337/create-payment-intent", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            priceId: selectedPlan.priceId,
                            userId: user._id,
                            serverId: selectedServerId,
                            duration: durationToDays(selectedDuration)
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to create payment intent');
                    }

                    const data = await response.json();
                    console.log('Payment intent data:', data);
                    setClientSecret(data.clientSecret);
                } catch (err) {
                    console.error('Error creating payment intent:', err);
                }
            };

            fetchPaymentIntent();
        }
    }, [selectedServerId, selectedDuration, selectedPlan, user?._id]);

    const handleCardClick = (serverId) => {
        setSelectedServerId(serverId);
        setSelectedDuration(null); // Reset the duration when a new server is selected
    };

    const handleDurationChange = (duration) => {
        setSelectedDuration(duration);
    };

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    return (
        <div className='flex flex-col items-center bg-slate-900 min-h-screen py-10 px-5'>
            <div className='bg-slate-700 p-5 rounded-lg shadow-lg w-full max-w-4xl'>
                <div className='flex justify-between mb-4'>
                    <button onClick={() => setActiveTab('plans')} className={clsx('px-4 py-2 rounded-lg', activeTab === 'plans' ? 'bg-indigo-600 text-white' : 'bg-indigo-900 text-neutral-100')}>Plans</button>
                    <button onClick={() => setActiveTab('uptime')} className={clsx('px-4 py-2 rounded-lg', activeTab === 'uptime' ? 'bg-indigo-600 text-white' : 'bg-indigo-900 text-neutral-100')}>Server Uptime</button>
                </div>
                {activeTab === 'plans' && (
                    <div>
                        <h1 className='text-xl font-semibold text-white mb-4'>Select a Location</h1>
                        <div className='flex flex-wrap gap-4 justify-center'>
                            {servers.map(server => (
                                <div
                                    key={server._id}
                                    className={`bg-slate-500 px-6 py-5 rounded-lg shadow-md flex gap-3 relative hover:bg-slate-800 cursor-pointer ${selectedServerId === server._id ? 'bg-gray-800 -translate-y-2 transform transition' : ''}`}
                                    onClick={() => handleCardClick(server._id)}
                                >
                                    <img src={server.flagUrl} alt={server.name} className='w-20 rounded-md' />
                                    <div>
                                        <h2 className='text-lg font-bold text-white'>{server.name}</h2>
                                        <p className='text-sm text-gray-200'>{server.location}</p>
                                        <span className='absolute text-xs top-0 right-0 -translate-y-3 translate-x-3 bg-green-500 rounded-2xl px-3 py-1 flex items-center justify-center text-white'>
                                            {server.slots} Slots Available
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedServerId && (
                            <div className='mt-10'>
                                <h2 className='text-xl font-semibold text-white mb-4'>Select a Duration</h2>
                                <Combobox value={selectedDuration} onChange={handleDurationChange} onClose={() => setQuery('')}>
                                    <div className="relative">
                                        <ComboboxInput
                                            className={clsx('w-full rounded-lg border-none bg-white/10 py-2 pr-10 pl-3 text-sm text-white', 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25')}
                                            displayValue={(duration) => duration}
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                            <FaChevronDown className="w-5 h-5 text-white" />
                                        </ComboboxButton>
                                    </div>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
                                        <ComboboxOptions className="absolute z-10 mt-1 max-w-screen max-h-60 overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredDurations.length === 0 && query !== '' ? (
                                                <div className="relative cursor-default select-none py-2 px-4 text-gray-400">Nothing found.</div>
                                            ) : (
                                                filteredDurations.map((plan) => (
                                                    <ComboboxOption key={plan.duration} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-300'}`} value={plan.duration}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{plan.duration}</span>
                                                                {selected ? (
                                                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'}`}>
                                                                        <FaCheck className="w-5 h-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </ComboboxOption>
                                                ))
                                            )}
                                        </ComboboxOptions>
                                    </Transition>
                                </Combobox>
                            </div>
                        )}
                        {selectedDuration && clientSecret && selectedPlan && (
                            <div className='mt-10'>
                                <h2 className='text-xl font-semibold text-white mb-4'>Payment</h2>
                                <Elements stripe={stripePromise} options={options}>
                                    <CheckoutForm
                                        clientSecret={clientSecret}
                                        userId={user?._id} // Pass the user ID to CheckoutForm
                                        serverId={selectedServerId}
                                        duration={selectedDuration}
                                        serverName={selectedServer?.name} // Pass serverName here
                                        price={selectedPlan.price} // Pass price here
                                    />
                                </Elements>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'uptime' && (
                    <ServerUptime servers={servers} />
                )}
            </div>
        </div>
    );
}
