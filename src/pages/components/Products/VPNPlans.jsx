import React, { useState, useEffect, Fragment } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import { FaCheck, FaChevronDown } from "react-icons/fa";
import clsx from 'clsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PeAYLBHxmLuJS3wMXyf5J9ohBlbGtIwqXawtQWVFZlKq7hEOKyUHna4sxBQfLU9zhoGuicsBXhlCoASXOgHLWNU00Qm5XcBkE');

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
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Jenny Rosen',
                },
            },
        });

        if (error) {
            console.log('[error]', error);
            // Handle error based on error code
            if (error.code === 'payment_intent_unexpected_state') {
                console.error('PaymentIntent is in an unexpected state.');
            }
        } else {
            console.log('[PaymentIntent]', paymentIntent);

            const durationInDays = durationToDays(duration); // Convert duration to days

            if (durationInDays === null) {
                console.error('Invalid duration format');
                return;
            }

            const updateData = {
                userId: userId,
                serverId: serverId,
                duration: durationInDays, // Send duration in days
                serverName: serverName // Pass serverName here
            };

            console.log('Updating user plan with data:', updateData);

            fetch('http://localhost:1337/user/update-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === 'success') {
                        console.log('Plan updated successfully:', data);
                    } else {
                        console.error('Error updating plan:', data.error);
                    }
                })
                .catch((err) => {
                    console.error('Error updating plan:', err);
                });

            setIsProcessing(false);
        }
    };

    return (
        <div className='bg-slate-300 text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <div>
                <p className='text-3xl font-bold py-4 flex'>{duration}</p>
                <p className='text-xl font-semibold py-4 flex'>${price / 100}</p>
            </div>
            <div className='text-2xl'>
                <form onSubmit={handleSubmit}>
                    <CardElement />
                    <button
                        className='py-5 w-full rounded-lg mt-10 text-slate-200 bg-indigo-700'
                        type="submit"
                        disabled={!stripe || isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Pay'}
                    </button>
                </form>
            </div>
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

        console.log('Current state:', {
            selectedServerId,
            selectedDuration,
            selectedPlan,
            user: user?._id,
            valid: isValidState()
        });

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
                            duration: selectedDuration
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
        } else {
            console.log('Waiting for all conditions to be met...');
        }
    }, [selectedServerId, selectedDuration, selectedPlan, user?._id]);

    const handleCardClick = (serverId) => {
        console.log('Selected server ID:', serverId);
        setSelectedServerId(serverId);
        setSelectedDuration(null); // Reset the duration when a new server is selected
    };

    const handleDurationChange = (duration) => {
        console.log('Selected duration ID:', duration);
        setSelectedDuration(duration);
    };

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    console.log('selectedDuration:', selectedDuration);
    console.log('clientSecret:', clientSecret);
    console.log('selectedPlan:', selectedPlan);

    return (
        <div className='flex flex-col items-center bg-slate-900 min-h-screen py-10 px-5'>
            <div className='bg-slate-700 p-5 rounded-lg shadow-lg w-full max-w-4xl'>
                <h1 className='text-xl font-semibold text-white mb-4'>Select a Location</h1>
                <div className='flex flex-wrap gap-4 justify-center'>
                    {servers.map(server => (
                        <div
                            key={server._id}
                            className={`bg-slate-500 px-6 py-5 rounded-lg shadow-md flex gap-3 relative hover:bg-slate-800 cursor-pointer ${selectedServerId === server._id ? 'bg-slate-800 -translate-y-2 transform transition' : ''}`}
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
        </div>
    );
}
