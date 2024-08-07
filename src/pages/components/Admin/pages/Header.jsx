import React, { Fragment } from 'react';
import { HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from 'react-icons/hi';
import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../AuthContext';

export default function Header() {
    const { userDetails, setIsLoggedIn, setUserDetails } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserDetails(null);
        navigate('/');
    };

    return (
        <div className='bg-slate-900 text-neutral-100 h-16 px-4 flex justify-between items-center border-b border-gray-200'>
            <div className='relative'>
                <HiOutlineSearch fontSize={20} className='absolute top-1/2 -translate-y-1/2 left-3' />
                <input type='text' placeholder='Search...' className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 bg-slate-900 rounded-lg pl-11 pr-4' />
            </div>
            <div className='flex items-center gap-2 mr-2'>
                <Popover className='relative'>
                    {({ open }) => (
                        <>
                            <PopoverButton className={classNames(open && 'bg-slate-800', 'p-1.5 rounded-xl inline-flex items-center hover:text-opacity-100 border-none focus:outline-none active:bg-slate-800')}>
                                <HiOutlineChatAlt fontSize={24} />
                            </PopoverButton>
                            <Transition
                                as={Fragment}
                                enter='transition ease-out duration-200'
                                enterFrom='opacity-0 translate-y-1'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition ease-in duration-150'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 translate-y-1'>
                                <PopoverPanel className='absolute right-0 z-10 mt-2.5 w-80'>
                                    <div className='bg-slate-900 rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                                        <strong className='font-medium'>Messages</strong>
                                        <div className='mt-2 py-1 text-sm'>
                                            This is the messages panel.
                                        </div>
                                    </div>
                                </PopoverPanel>
                            </Transition>
                        </>
                    )}
                </Popover>
                <Popover className='relative'>
                    {({ open }) => (
                        <>
                            <PopoverButton className={classNames(open && 'bg-slate-800', 'p-1.5 rounded-xl inline-flex items-center hover:text-opacity-100 border-none focus:outline-none active:bg-slate-800')}>
                                <HiOutlineBell fontSize={24} />
                            </PopoverButton>
                            <Transition
                                as={Fragment}
                                enter='transition ease-out duration-200'
                                enterFrom='opacity-0 translate-y-1'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition ease-in duration-150'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 translate-y-1'>
                                <PopoverPanel className='absolute right-0 z-10 mt-2.5 w-80'>
                                    <div className='bg-slate-900 rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                                        <strong className='font-medium'>Notifications</strong>
                                        <div className='mt-2 py-1 text-sm'>
                                            This is the notifications panel.
                                        </div>
                                    </div>
                                </PopoverPanel>
                            </Transition>
                        </>
                    )}
                </Popover>
                <Menu as='div' className='relative'>
                    <MenuButton className='border-none ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400'>
                        <span className='sr-only'>Open user menu</span>
                        <div className='h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center' style={{ backgroundImage: `url(${userDetails.profilePicture || 'default-profile.png'})` }}>
                            <span className='sr-only'>{userDetails.username}</span>
                        </div>
                    </MenuButton>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'>
                        <MenuItems className='origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-sm p-1 bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <MenuItem>
                                {({ active }) => (
                                    <div className={classNames(active && 'bg-slate-800', ' focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')} onClick={() => navigate('/profile')}>Your Profile</div>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <div className={classNames(active && 'bg-slate-800', 'focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')} onClick={() => navigate('/admin/settings')}>Settings</div>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <div className={classNames(active && 'bg-slate-800', 'focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')} onClick={handleLogout}>Sign Out</div>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
}
