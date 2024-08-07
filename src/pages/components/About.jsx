import React, { useEffect, useState } from 'react';

const About = () => {
    const [totalUsers, setTotalUsers] = useState(null);

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const response = await fetch('http://localhost:1337/users/total');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched total users:', data); // Debugging log
                setTotalUsers(data.total);
            } catch (error) {
                console.error('Failed to fetch total users', error);
            }
        };

        fetchTotalUsers();
    }, []);

    const loadingthingy = () => {
        return (
            <div className="flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-dotted rounded-full animate-spin"></div>
            </div>
        );
    };

    return (
        <div name='about' className='w-full my-32 border-slate-300 border-t pt-32'>
            <div className='max-w-[1240px] mx-auto'>
                <div className='text-center'>
                    <h2 className='text-5xl font-bold'>Trusted by developers across the world</h2>
                    <p className='text-3xl py-6 text-neutral-300'>All in one secure platform. Access the internet with our offshore VPN</p>
                </div>

                <div className='grid md:grid-cols-3 gap-1 px-2 text-center'>
                    <div className='border py-8 rounded-xl shadow-xl bg-slate-800'>
                        <p className='text-6xl font-bold text-indigo-400'>100%</p>
                        <p className='text-neutral-300 mt-2'>Uptime</p>
                    </div>
                    <div className='border py-8 rounded-xl shadow-xl bg-slate-800'>
                        <p className='text-6xl font-bold text-indigo-400'>24/7</p>
                        <p className='text-neutral-300 mt-2'>Support</p>
                    </div>
                    <div className='border py-8 rounded-xl shadow-xl bg-slate-800'>
                        {totalUsers !== null ? (
                            <p className='text-6xl font-bold text-indigo-400'>{totalUsers}</p>
                        ) : (
                            loadingthingy()
                        )}
                        <p className='text-neutral-300 mt-2'>Users</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;