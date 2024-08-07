import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Menu, MenuButton, MenuItem, Transition, MenuItems } from '@headlessui/react';
import classNames from 'classnames';
import { useAuth } from '../../AuthContext';
import Logo from '../assets/logo_flat_alt.png';

const Navbar = () => {
  const { user, setUser, fetchUserDetails, login, logout } = useAuth();
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setNav(!nav);
  const handleClose = () => setNav(false);
  const handleLoginRedirect = () => navigate('/auth/login');
  const handleRegisterRedirect = () => navigate('/auth/register');

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  const handleProfilePage = () => {
    navigate('/profile');
  };

  const handleSettingsPage = () => {
    navigate('/profile?page=Settings');
  };

  const initializeUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        try {
          const userDetails = await fetchUserDetails();
          setUser(userDetails);
          localStorage.setItem('user', JSON.stringify(userDetails));
          login(token);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  }, [fetchUserDetails, setUser, login]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <div className='w-screen h-[80px] z-10 bg-slate-300 fixed drop-shadow-lg pl-10'>
      <div className='px-2 flex justify-between items-center w-full h-full'>
        <div className='flex items-center'>
          <RouterLink to='/'><img src={Logo} alt='logo' /></RouterLink>
          <ul className='hidden md:flex pl-5'>
            <li><Link to='home' smooth={true} duration={500}>Home</Link></li>
            <li><Link to='about' smooth={true} offset={-200} duration={500}>About</Link></li>
            <li><Link to='services' smooth={true} offset={-50} duration={500}>Services</Link></li>
            <li><Link to='pricing' smooth={true} offset={-50} duration={500}>Pricing</Link></li>
            <li><Link to='terms' smooth={true} offset={-50} duration={500}>Terms</Link></li>
          </ul>
        </div>
        <div className='hidden md:flex mr-10'>
          {user ? (
            <>
              <Menu as='div' className='relative'>
                <MenuButton className='border-none ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400'>
                  <span className='sr-only'>Open user menu</span>
                  <div className='h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center' style={{ backgroundImage: `url(${user.profilePicture || 'default-profile-picture-url'})` }}>
                    <span className='sr-only'>{user.username}</span>
                  </div>
                </MenuButton>
                <Transition
                  as={React.Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-0 scale-95'
                  leaveTo='transform opacity-100 scale-100'>
                  <MenuItems className='origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-sm p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <MenuItem>
                      {({ active }) => (
                        <div onClick={handleProfilePage} className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}>Your Profile</div>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <div onClick={handleSettingsPage} className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}>Settings</div>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <div onClick={handleLogout} className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}>Sign Out</div>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </>
          ) : (
            <>
              <button onClick={handleLoginRedirect} className='border-none bg-transparent text-black mr-4 outline outline-black rounded-lg py-3 px-5 outline-1 hover:bg-indigo-700 hover:text-white'>Sign In</button>
              <button onClick={handleRegisterRedirect} className='px-8 py-3 outline outline-black rounded-lg outline-1 hover:bg-indigo-700 hover:text-white'>Sign Up</button>
            </>
          )}
        </div>
        <div className='md:hidden mr-4' onClick={handleClick}>
          {!nav ? <MenuIcon className='w-5' /> : <XIcon className='w-5' />}
        </div>
      </div>
      <ul className={!nav ? 'hidden' : 'absolute bg-zinc-200 w-full px-8'}>
        <li className='border-b-2 border-zinc-300 w-full'><Link onClick={handleClose} to='home' smooth={true} duration={500}>Home</Link></li>
        <li className='border-b-2 border-zinc-300 w-full'><Link onClick={handleClose} to='about' smooth={true} offset={-200} duration={500}>About</Link></li>
        <li className='border-b-2 border-zinc-300 w-full'><Link onClick={handleClose} to='support' smooth={true} offset={-50} duration={500}>Support</Link></li>
        <li className='border-b-2 border-zinc-300 w-full'><Link onClick={handleClose} to='pricing' smooth={true} offset={-50} duration={500}>Pricing</Link></li>
        <li className='border-b-2 border-zinc-300 w-full'><Link onClick={handleClose} to='terms' smooth={true} offset={-50} duration={500}>Terms</Link></li>

        <div className='flex flex-col my-4'>
          {user ? (
            <>
              <Menu as='div' className='relative'>
                <MenuButton className='border-none ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400'>
                  <span className='sr-only'>Open user menu</span>
                  <div className='h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center' style={{ backgroundImage: `url(${user.profilePicture || 'default-profile-picture-url'})` }}>
                    <span className='sr-only'>{user.username}</span>
                  </div>
                </MenuButton>
                <Transition
                  as={React.Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-0 scale-95'
                  leaveTo='transform opacity-100 scale-100'>
                  <MenuItems className='origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-sm p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <MenuItem>
                      {({ active }) => (
                        <div onClick={handleProfilePage} className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}>Your Profile</div>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <div onClick={handleSettingsPage} className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}>Settings</div>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <div onClick={handleLogout} className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}>Sign Out</div>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </>
          ) : (
            <>
              <button onClick={handleLoginRedirect} className='bg-transparent text-indigo-600 px-8 py-3 mb-4'>Sign In</button>
              <button onClick={handleRegisterRedirect} className='px-8 py-3'>Sign Up</button>
            </>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;