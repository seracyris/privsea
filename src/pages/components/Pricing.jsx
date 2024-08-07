import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';
import LoginPopup from './LoginPopup';
import CreatePopup from './CreatePopup'; // Import CreatePopup if you need it
import { useAuth } from '../../AuthContext'; // Import the useAuth hook

const Pricing = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // Use the useAuth hook to get the login status
  const [loginPopup, setLoginPopup] = useState(false);
  const [createPopup, setCreatePopup] = useState(false);

  const handleProductNav = () => {
    if (isLoggedIn) {
      navigate('/profile?page=Products');
    } else {
      setLoginPopup(true);
    }
  };

  return (
    <div name='pricing' className='w-full text-white my-24'>
      <div className='w-full h-[800px] bg-slate-900 absolute mix-blend-overlay'></div>
      <div className='max-w-[1240px] mx-auto py-12'>
        <div className='text-center py-8 text-slate-300'>
          <h2 className='text-3xl uppercase'>Pricing</h2>
          <h3 className='text-5xl font-bold text-white py-8'>Select Pricing Plan</h3>
          <p className='text-2xl'>Choose the plan that works for you. All plans are non-refundable upon purchase or cancellation</p>
        </div>

        <div className='grid md:grid-cols-3'>
          {[1, 3, 6].map((months, index) => (
            <div key={index} className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
              <span className={`uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm`}>{months} Month{months > 1 ? 's' : ''}</span>
              <div>
                <p className='text-6xl font-bold py-4 flex'>
                  ${months === 1 ? '4.99' : months === 3 ? '11.99' : '24.99'}
                  <span className='text-xl text-slate-500 flex flex-col justify-end'>/{months}mo</span>
                </p>
              </div>
              <div className='text-2xl'>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />OpenVPN Config</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />10GB Port Speed</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />DDoS Protection</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Game Firewalls</p>
                <p className='flex py-4'><CheckIcon className='w-8 mr-5 text-green-600' />Multiple Locations</p>
                <button className='w-full py-4 my-4 bg-indigo-600 rounded-xl text-neutral-300 hover:bg-indigo-800 hover:text-white' onClick={handleProductNav}>Get Started</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LoginPopup trigger={loginPopup} setTrigger={setLoginPopup} setCreatePopup={setCreatePopup} />
      <CreatePopup trigger={createPopup} setTrigger={setCreatePopup} setLoginPopup={setLoginPopup} />
    </div>
  );
};

export default Pricing;
