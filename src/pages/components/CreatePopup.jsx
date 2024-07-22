import React, { useState } from 'react';
import Cyber from '../assets/cyber-bg.png';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaDiscord } from 'react-icons/fa';

const CreatePopup = (props) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:1337/auth/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert('Signup Success');
            localStorage.setItem('token', data.user);
            window.location.href = '/profile';
        } else {
            alert('Error creating account: ' + data.error);
        }
    };

    return (props.trigger) ? (
        <div className='flex flex-row justify-center items-center'>
            <div className='h-[40rem] flex justify-center items-center rounded-lg shadow-lg min-w-[50%] bg-sky-300 p-5'>
                <div className='w-screen bg-white h-full rounded-lg p-10 relative md:w-1/2 flex flex-col'>
                    <button className='border-none bg-transparent text-black hover:text-red-500 absolute right-10 top-8' onClick={() => props.setTrigger(false)}>X</button>
                    <h2 className='font-bold text-2xl'>Sign up</h2>
                    <p className='text-sm mt-4'>Lets get you encrypted</p>
                    <form className='flex flex-col gap-4' onSubmit={handleSignup}>
                        <input className='p-2 mt-8 rounded-xl border' type='text' name='username' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input className='p-2 rounded-xl border' type='email' name='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div className='relative'>
                            <input className='p-2 rounded-xl border w-full' type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoIosEyeOff fontSize={20} /> : <IoIosEye fontSize={20} />}
                            </div>
                        </div>
                        <button className='p-2 rounded-xl bg-sky-300 border-none hover:bg-sky-600 hover:text-white hover:scale-105 duration-300'>Sign up</button>
                    </form>
                    <div className='mt-10 grid grid-cols-3 items-center text-gray-500'>
                        <hr className='border-gray-500' />
                        <p className='text-center'>OR</p>
                        <hr className='border-gray-500' />
                    </div>
                    <button className='hover:scale-110 duration-300 py-2 px-5 mt-5 rounded-xl bg-indigo-900 border-none hover:bg-indigo-600 hover:text-white flex flex-row gap-1 justify-center items-center' onClick={() => window.location.href = 'http://localhost:1337/auth/discord'}>
                        <FaDiscord fontSize={20} />
                        <span className='px-2 py-1'>Sign up with Discord</span>
                    </button>
                    <div className='text-xs flex justify-between items-center mt-5'>
                        <p>Already have an account..</p>
                        <button className='py-2 px-5 bg-transparent text-sky-600 underline border-none hover:scale-105 duration-300' onClick={() => { props.setTrigger(false); props.setLoginPopup(true); }}>Login</button>
                    </div>
                </div>
                <div className='md:block hidden'>
                    <img className='rounded-2xl' src={Cyber} />
                </div>
            </div>
        </div>
    ) : '';
};

export default CreatePopup;
