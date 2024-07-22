import React from 'react';

import { PhoneIcon, ArrowSmRightIcon } from '@heroicons/react/outline';
import { MailIcon, LockClosedIcon } from '@heroicons/react/solid'

import supportImg from '../assets/support.jpg'

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
                    <p className='py-4 text-3xl text-slate-300'>All our products do not require a username or password. You will be given a unique 32 character user id that will be used to log into all your products. Do not share your user id it will allow others to access your account.</p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 relative gap-x-8 gap-y-16 px-4 pt-12 sm:pt-20 text-black'>
                    <div className='bg-white rounded-xl shadow-2xl'>
                        <div className='p-8'>
                            <PhoneIcon className='w-16 p-4 bg-indigo-600 text-white rounded-lg mt-[-4rem]' />
                            <h3 className='font-bold text-2xl my-6'>SMS/VoIP</h3>
                            <p className='text-gray-600 text-xl'>Get active phone numbers that can be used to verify accounts or text and make phone calls with custom messages or with our encrypted VoIP client.</p>
                        </div>
                        <div className='bg-slate-100 pl-8 py-4'>
                            <a href='https://discord.gg/Pb8hXPuyjA' rel='noreferrer' target='_blank'><p className='flex items-center text-indigo-600'>Contact Us <ArrowSmRightIcon className='w-5 ml-2' /></p></a>
                        </div>
                    </div>
                    <div className='bg-white rounded-xl shadow-2xl'>
                        <div className='p-8'>
                            <LockClosedIcon className='w-16 p-4 bg-indigo-600 text-white rounded-lg mt-[-4rem]' />
                            <h3 className='font-bold text-2xl my-6'>Encrypted VPN</h3>
                            <p className='text-gray-600 text-xl'>VPN client with multiple countries, no logs for anonymous browsing. Choice of Wireguard or OpenVPN. Limited to one device for the time being.</p>
                        </div>
                        <div className='bg-slate-100 pl-8 py-4'>
                            <a href='https://discord.gg/Pb8hXPuyjA' rel='noreferrer' target='_blank'><p className='flex items-center text-indigo-600'>Contact Us <ArrowSmRightIcon className='w-5 ml-2' /></p></a>
                        </div>
                    </div>
                    <div className='bg-white rounded-xl shadow-2xl'>
                        <div className='p-8'>
                            <MailIcon className='w-16 p-4 bg-indigo-600 text-white rounded-lg mt-[-4rem]' />
                            <h3 className='font-bold text-2xl my-6'>Encrypted Email</h3>
                            <p className='text-gray-600 text-xl'>Secure loggless offshore email client. No logs and inbox purge features. Spam email defense, as well as email spoofing. Email can be used for accounts or messaging.</p>
                        </div>
                        <div className='bg-slate-100 pl-8 py-4'>
                            <a href='https://discord.gg/Pb8hXPuyjA' rel='noreferrer' target='_blank'><p className='flex items-center text-indigo-600'>Contact Us <ArrowSmRightIcon className='w-5 ml-2' /></p></a>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Services;
