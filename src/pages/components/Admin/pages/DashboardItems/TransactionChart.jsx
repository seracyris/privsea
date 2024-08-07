import { Legend } from '@headlessui/react'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

const data = [
    {
        name: 'Jan',
        Expense: '5.00',
        Income: '40.00'
    },
    {
        name: 'Feb',
        Expense: '5.00',
        Income: '63.00'
    },
    {
        name: 'Mar',
        Expense: '5.00',
        Income: '120.00'
    },
    {
        name: 'Apr',
        Expense: '5.00',
        Income: '534.00'
    },
    {
        name: 'May',
        Expense: '5.00',
        Income: '10.00'
    },
    {
        name: 'Jun',
        Expense: '5.00',
        Income: '62.00'
    },
    {
        name: 'Jul',
        Expense: '5.00',
        Income: '98.00'
    },
    {
        name: 'Aug',
        Expense: '5.00',
        Income: '81.00'
    },
    {
        name: 'Sep',
        Expense: '5.00',
        Income: '80.00'
    },
    {
        name: 'Oct',
        Expense: '5.00',
        Income: '756.00'
    },
    {
        name: 'Nov',
        Expense: '5.00',
        Income: '134.00'
    },
    {
        name: 'Dec',
        Expense: '5.00',
        Income: '60.00'
    }
]

const TransactionChart = () => {
    return (
        <div className='h-[22rem] bg-slate-900 text-neutral-100 p-4 rounded-sm flex flex-col flex-1'>
            <strong className='font-medium'>Transactions</strong>
            <div className='w-full mt-3 flex-1 text-xs'>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart width={500} height={300} data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray='3 3 0 0' vertical={false} />
                        <XAxis dataKey='name' />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='Income' fill='#8ea5e9' />
                        <Bar dataKey='Expense' fill='#ea580c' />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default TransactionChart