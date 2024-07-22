import React from 'react'
import { Link } from 'react-router-dom'

const recentOrderData = [
    {
        id: '1',
        product_id: '123',
        customer_id: '456',
        customer_name: 'Customer Name',
        order_date: '2024-07-14T05:24:00',
        order_total: '5.00',
        order_status: 'COMPLETED',
        duration: '60'
    },
    {
        id: '2',
        product_id: '123',
        customer_id: '456',
        customer_name: 'Customer Name',
        order_date: '2024-07-14T05:24:00',
        order_total: '5.00',
        order_status: 'COMPLETED',
        duration: '360'
    },
    {
        id: '3',
        product_id: '123',
        customer_id: '456',
        customer_name: 'Customer Name',
        order_date: '2024-07-14T05:24:00',
        order_total: '5.00',
        order_status: 'COMPLETED',
        duration: '90'
    },
    {
        id: '4',
        product_id: '123',
        customer_id: '456',
        customer_name: 'Customer Name',
        order_date: '2024-07-14T05:24:00',
        order_total: '5.00',
        order_status: 'COMPLETED',
        duration: '30'
    },
    {
        id: '5',
        product_id: '123',
        customer_id: '456',
        customer_name: 'Customer Name',
        order_date: '2024-07-14T05:24:00',
        order_total: '5.00',
        order_status: 'COMPLETED',
        duration: '60'
    },
]

const RecentOrders = () => {
    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong className='text-gray-700 font-medium'>Recent Orders</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700'>
                    <thead>
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
                        {recentOrderData.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td><Link to={'/admin/products/${order.product_id}'}>{order.product_id}</Link></td>
                                <td><Link to={'/admin/customers/${order.customer_id}'}>{order.customer_id}</Link></td>
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
    )
}

export default RecentOrders