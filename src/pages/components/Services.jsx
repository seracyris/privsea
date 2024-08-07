import React from 'react';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
import { LockClosedIcon } from '@heroicons/react/solid';
import { MdOutlineSecurity } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";

import supportImg from '../assets/support.jpg';

const Services = () => {
    return (
        <div name='services' className='w-full mt-24'>
            <div className='w-full h-[700px] bg-gray-900/90 absolute'>
                <img className='w-full h-full object-cover mix-blend-overlay' src={supportImg} alt="/" />
            </div>

            <div className='max-w-[1240px] mx-auto text-white relative'>
                <div className='px-4 py-12'>
                    <h2 className='text-3xl pt-8 text-slate-300 uppercase text-center'>Services</h2>
                    <h3 className='text-5xl font-bold py-6 text-center'>Privsea Networks</h3>
                    <p className='py-4 text-3xl text-slate-300'>All our products do not require a username or password. You will be given a unique 32 character user ID that will be used to log into all your products. Do not share your user ID as it will allow others to access your account.</p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-16 px-4 pt-12 sm:pt-20 text-black'>
                    <div className='bg-white rounded-xl shadow-2xl flex flex-col'>
                        <div className='p-8 flex-grow'>
                            <FaGlobe className='w-16 h-16 p-4 bg-indigo-600 text-white rounded-lg mt-[-4rem] mx-auto' />
                            <h3 className='font-bold text-2xl my-6 text-center'>Worldwide Locations</h3>
                            <p className='text-gray-600 text-xl text-center'>
                                Get access to servers near you. We have multiple server locations across the US, Europe, and East Asia to ensure the best possible connection and minimal latency.
                                Choose the location that best suits your needs for the fastest and most reliable service.
                            </p>
                            <ul className='list-disc pl-6 text-gray-600 text-center mt-4'>
                                <li>Low latency connections</li>
                                <li>High-speed data transfer</li>
                                <li>Multiple regions for optimal performance</li>
                            </ul>
                        </div>
                        <div className='bg-slate-100 py-4 text-center'>
                            <a href='https://discord.gg/SeRMRBdT7n' rel='noreferrer' target='_blank'>
                                <p className='flex items-center justify-center text-indigo-600'>
                                    Contact Us <ArrowSmRightIcon className='w-5 ml-2' />
                                </p>
                            </a>
                        </div>
                    </div>

                    <div className='bg-white rounded-xl shadow-2xl flex flex-col'>
                        <div className='p-8 flex-grow'>
                            <LockClosedIcon className='w-16 h-16 p-4 bg-indigo-600 text-white rounded-lg mt-[-4rem] mx-auto' />
                            <h3 className='font-bold text-2xl my-6 text-center'>Encrypted VPN</h3>
                            <p className='text-gray-600 text-xl text-center'>
                                Our VPN client offers secure and encrypted connections with servers in multiple countries.
                                Enjoy anonymous browsing with no logs. Currently limited to one device per account.
                            </p>
                            <ul className='list-disc pl-6 text-gray-600 text-center mt-4'>
                                <li>No logs for anonymous browsing</li>
                                <li>Secure and encrypted connections</li>
                            </ul>
                        </div>
                        <div className='bg-slate-100 py-4 text-center'>
                            <a href='https://discord.gg/SeRMRBdT7n' rel='noreferrer' target='_blank'>
                                <p className='flex items-center justify-center text-indigo-600'>
                                    Contact Us <ArrowSmRightIcon className='w-5 ml-2' />
                                </p>
                            </a>
                        </div>
                    </div>

                    <div className='bg-white rounded-xl shadow-2xl flex flex-col'>
                        <div className='p-8 flex-grow'>
                            <MdOutlineSecurity className='w-16 h-16 p-4 bg-indigo-600 text-white rounded-lg mt-[-4rem] mx-auto' />
                            <h3 className='font-bold text-2xl my-6 text-center'>DDoS Protection</h3>
                            <p className='text-gray-600 text-xl text-center'>
                                Our service includes robust DDoS protection to keep your connection stable and secure.
                                With advanced filtering and mitigation techniques, we ensure minimal disruption from malicious traffic.
                            </p>
                            <ul className='list-disc pl-6 text-gray-600 text-center mt-4'>
                                <li>Advanced DDoS mitigation</li>
                                <li>Continuous monitoring</li>
                                <li>Reliable protection against attacks</li>
                            </ul>
                        </div>
                        <div className='bg-slate-100 py-4 text-center'>
                            <a href='https://discord.gg/SeRMRBdT7n' rel='noreferrer' target='_blank'>
                                <p className='flex items-center justify-center text-indigo-600'>
                                    Contact Us <ArrowSmRightIcon className='w-5 ml-2' />
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
