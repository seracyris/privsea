import React from 'react'
import { HiOutlineUsers, HiShoppingCart, HiShoppingBag, HiCash } from 'react-icons/hi'

const sales = '100,000.00'
const addedsales = '300.00'
const expenses = '34,000.00'
const addedexpenses = '21.00'
const customers = '30'
const addedcustomers = '2'
const orders = '45'
const addedorders = '13'

const StatsGrid = () => {
    return (
        <div className='flex gap-4 w-full'>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
                    <HiShoppingBag className='text-2xl text-white' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total Sales</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>${sales}</strong>
                        <span className='text-sm text-green-500 pl-2'>+{addedsales}</span>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
                    <HiCash className='text-2xl text-white' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total Expenses</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>${expenses}</strong>
                        <span className='text-sm text-green-500 pl-2'>+{addedexpenses}</span>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-500'>
                    <HiOutlineUsers className='text-2xl text-white' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total Customers</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>{customers}</strong>
                        <span className='text-sm text-green-500 pl-2'>+{addedcustomers}</span>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-500'>
                    <HiShoppingCart className='text-2xl text-white' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total Orders</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>{orders}</strong>
                        <span className='text-sm text-red-500 pl-2'>+{addedorders}</span>
                    </div>
                </div>
            </BoxWrapper>
        </div>
    )
}

export default StatsGrid

const BoxWrapper = ({ children }) => {
    return <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>{children}</div>
}