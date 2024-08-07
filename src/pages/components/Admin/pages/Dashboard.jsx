import React from 'react'
import Header from './Header'
import StatsGrid from './DashboardItems/StatsGrid'
import TransactionChart from './DashboardItems/TransactionChart'
import RecentOrders from './DashboardItems/RecentOrders'

const Dashboard = () => {
    return (
        <div className='bg-slate-900 h-screen'>
            <Header />
            <div className='flex flex-col gap-4 py-6'>
                <StatsGrid />
                <TransactionChart />
            </div>
            <div className='flex flex-col gap-4'>
                <RecentOrders />
            </div>
        </div>
    )
}

export default Dashboard