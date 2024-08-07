import React from 'react'
import { Link } from 'react-scroll'

import bgImg from '../assets/cyber-bg.png'

const Hero = () => {
    return (
        <div name='home' className='w-full h-screen bg-slate-900 flex flex-col justify-between'>
            <div className='grid md:grid-cols-2 max-w-[1240px] m-auto'>
                <div className='flex flex-col justify-center md:items-start w-full px-2 py-8'>
                    <p className='text-2xl'>Secure & Anonymous Platform</p>
                    <h1 className='py-3 text-5xl md:text-7xl font-bold'>Privsea VPN</h1>
                    <Link to='pricing' className='py-5 px-8 sm:w-[60%] my-4 bg-indigo-700 rounded-lg text-white cursor-pointer text-center hover:no-underline' smooth={true} offset={-50} duration={500}>Get Started</Link>
                </div>
                <div>
                    <img className='w-full' src={bgImg} alt="/" />
                </div>
            </div>
        </div>
    )
}

export default Hero