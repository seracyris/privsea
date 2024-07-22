import React from 'react'

import {
    FaTelegram,
    FaGithub,
    FaDiscord,
} from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='w-full mt-24 bg-slate-900 text-gray-300 py-y px-2'>
            <div className='flex flex-col max-w-[1240px] px-2 py-4 mx-auto justify-between sm:flex-row text-center text-gray-500'>
                <p className='py-4'>2024 Privsea Networks. All rights reserved</p>
                <div className='flex justify-between sm:w-[300px] pt-4 text-2xl'>
                    <a href='https://t.me/privsea' rel='noreferrer' target='_blank'><FaTelegram /></a>
                    <a href='https://discord.gg/Pb8hXPuyjA' rel='noreferrer' target='_blank'><FaDiscord /></a>
                    <a href='https://github.com' rel='noreferrer' target='_blank'><FaGithub /></a>
                </div>
            </div>
        </div>
    )
}

export default Footer