import React from 'react'
import Header from './Header'
import RecentOrders from './DashboardItems/RecentOrders'

const Orders = () => {
    return (
        <div className='bg-slate-900 h-screen'>
            <Header />
            <RecentOrders />
        </div>
    )
}

export default Orders