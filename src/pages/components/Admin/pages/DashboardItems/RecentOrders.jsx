import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecentOrders = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:1337/users/transactions'); // Update the URL as needed
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className='bg-slate-900 text-neutral-100 px-4 pt-3 pb-4 rounded-sm flex-1'>
            <strong className='font-medium'>Recent Orders</strong>
            <div className='mt-3'>
                <table className='w-full'>
                    <thead className='bg-slate-900'>
                        <tr>
                            <td>ID</td>
                            <td>Product ID</td>
                            <td>Customer ID</td>
                            <td>Customer Name</td>
                            <td>Order Date</td>
                            <td>Order Total</td>
                            <td>Order Status</td>
                            <td>Duration</td>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((order) => (
                            <tr key={order._id}>
                                <td>#{order._id}</td>
                                <td><Link to={`/admin/products/${order.product_id}`}>{order.product_id}</Link></td>
                                <td><Link to={`/admin/customers/${order.customer_id}`}>{order.customer_id}</Link></td>
                                <td>{order.customer_name}</td>
                                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                <td>${order.order_total}</td>
                                <td className='text-green-400'>{order.order_status}</td>
                                <td>{order.duration} days</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
