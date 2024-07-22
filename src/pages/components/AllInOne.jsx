import React from 'react';
import { CheckIcon } from '@heroicons/react/outline';

const AllInOne = () => {
  return (
    <div name='platforms' className='w-full my-32'>
      <div className='max-w-[1240px] mx-auto px-2'>
        <h2 className='text-5xl font-bold text-center'>Privsea Platform</h2>
        <p className='text-2xl py-8 text-gray-500 text-center'>
          We aim to create a network of services that can help users feel safer online. We do not condone any illegal activity on our platform, we will not give out any message information or request any information from you. Accounts are anonymously generated and can be nuked completely with the click of a button.
        </p>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>

          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>User Ethics</h3>
              <p className='text-lg pt-2 pb-4'>
                We trust that our users will use our platform in an ethical way and not cause harm or break any laws. If we get a report about unethical use towards governments your account will be nuked and you will not be refunded for your plan.
              </p>
            </div>
          </div>
          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>Account Nuke</h3>
              <p className='text-lg pt-2 pb-4'>
                If you decide you no longer want your account to exist you have the option to nuke it. This will delete your user and everything connected to it. If you had an active plan you will not be refunded so keep it in mind and only use the Nuke feature as a last resort.
              </p>
            </div>
          </div>
          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>User IDs</h3>
              <p className='text-lg pt-2 pb-4'>
                We don't use usernames or passwords to log into accounts. Instead we use uniquely generated user IDs to access accounts. This means if you lose your ID you will not be able to recover your account and will have to create a new one.
              </p>
            </div>
          </div>
          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>Open Source</h3>
              <p className='text-lg pt-2 pb-4'>
                We post all of our code on our documentation page, with descriptions on how it works and what it does. We reserve the rights to all the code posted.
              </p>
            </div>
          </div>
          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>VPN Client</h3>
              <p className='text-lg pt-2 pb-4'>
                Our VPN Client is available on Windows as an exe, MacOS as a dmg, and on Linux as an App Image. We will be creating IOS and Android clients in the near future.
              </p>
            </div>
          </div>
          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>Email Client</h3>
              <p className='text-lg pt-2 pb-4'>
                Our Email Client is only accessible through the web. We will not be making a desktop app in the forseable future. It can be accessed on any device via the web however.
              </p>
            </div>
          </div>
          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>SMS Credits</h3>
              <p className='text-lg pt-2 pb-4'>
                SMS Credits can be purchased via crypto on our market page, you can then use these credits to verify accounts and rent temporary phone numbers to text and call from.
              </p>
            </div>
          </div>
          <div className='flex'>
            <div>
              <CheckIcon className='w-7 mr-4 text-green-600' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>Refunds</h3>
              <p className='text-lg pt-2 pb-4'>
                We do not offer any refunds for any products. We advise you look over our products before making a purchase, as we are not responsible if you lose access to your account.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AllInOne;
