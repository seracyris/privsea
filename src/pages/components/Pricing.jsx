import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const handleProductNav = () => {
    navigate('/products');
  };

  return (
    <div name='pricing' className='w-full text-white my-24'>
      <div className='w-full h-[800px] bg-slate-900 absolute mix-blend-overlay'></div>

      <div className='max-w-[1240px] mx-auto py-12'>

        <div className='text-center py-8 text-slate-300'>
          <h2 className='text-3xl uppercase'>Pricing</h2>
          <h3 className='text-5xl font-bold text-white py-8'>Select Pricing Plan</h3>
          <p className='text-3xl'>
            All sales are done through crypto transactions and no refunds are applied for cancelation of account.
          </p>
        </div>

        <div className='grid md:grid-cols-3'>
          <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>1 Month</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>$4.99<span className='text-xl text-slate-500 flex flex-col justify-end'>/mo</span></p>
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
          <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>3 Months</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>$11.99<span className='text-xl text-slate-500 flex flex-col justify-end'>/3mo</span></p>
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
          <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>6 Months</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>$24.99<span className='text-xl text-slate-500 flex flex-col justify-end'>/6mo</span></p>
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
        </div>
      </div>
    </div>
  );
};

export default Pricing;
