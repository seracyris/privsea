import React, { useEffect, useState } from 'react';
import { HiOutlineUsers, HiShoppingCart, HiShoppingBag, HiCash } from 'react-icons/hi';
import axios from 'axios';

const StatsGrid = () => {
    const [sales, setSales] = useState(0);
    const [addedsales, setAddedSales] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [addedexpenses, setAddedExpenses] = useState(0);
    const [customers, setCustomers] = useState(0);
    const [addedcustomers, setAddedCustomers] = useState(0);
    const [orders, setOrders] = useState(0);
    const [addedorders, setAddedOrders] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:1337/users');
                const transactionsResponse = await axios.get('http://localhost:1337/users/transactions');

                const users = usersResponse.data.users;
                const transactions = transactionsResponse.data;

                const totalSales = transactions.reduce((total, transaction) => total + parseFloat(transaction.order_total), 0);
                const totalOrders = transactions.length;
                const totalCustomers = users.length;
                const totalExpenses = totalOrders * 5; // Assuming a static expense per order

                // For added stats, we'll just use dummy values as example
                const dummyAddedSales = 0;
                const dummyAddedExpenses = 0;
                const dummyAddedCustomers = 0;
                const dummyAddedOrders = 0;

                setSales(totalSales.toFixed(2));
                setExpenses(totalExpenses.toFixed(2));
                setCustomers(totalCustomers);
                setOrders(totalOrders);
                setAddedSales(dummyAddedSales.toFixed(2));
                setAddedExpenses(dummyAddedExpenses.toFixed(2));
                setAddedCustomers(dummyAddedCustomers);
                setAddedOrders(dummyAddedOrders);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex gap-4 w-full bg-slate-900'>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
                    <HiShoppingBag className='text-2xl text-neutral-100' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm font-light'>Total Sales</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold'>${sales}</strong>
                        <span className='text-sm text-green-500 pl-2'>+{addedsales}</span>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
                    <HiCash className='text-2xl text-neutral-100' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm font-light'>Total Expenses</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold'>${expenses}</strong>
                        <span className='text-sm text-green-500 pl-2'>+{addedexpenses}</span>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-500'>
                    <HiOutlineUsers className='text-2xl text-neutral-100' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm font-light'>Total Customers</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold'>{customers}</strong>
                        <span className='text-sm text-green-500 pl-2'>+{addedcustomers}</span>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-500'>
                    <HiShoppingCart className='text-2xl text-neutral-100' />
                </div>
                <div className='pl-4'>
                    <span className='text-sm font-light'>Total Orders</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold'>{orders}</strong>
                        <span className='text-sm text-red-500 pl-2'>+{addedorders}</span>
                    </div>
                </div>
            </BoxWrapper>
        </div>
    );
};

const BoxWrapper = ({ children }) => {
    return <div className='bg-slate-900 text-neutral-100 rounded-sm p-4 flex-1 flex items-center'>{children}</div>;
};

export default StatsGrid;