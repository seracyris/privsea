import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Settings from './pages/Settings'
import React from 'react';

const componentMap = {
    Dashboard: Dashboard,
    Products: Products,
    Orders: Orders,
    Customers: Customers,
    Settings: Settings,
}

const PageLayout = (props) => {
    const { page } = props;
    const Component = componentMap[page];
    if (!Component) {
        return <div className='w-screen h-screen bg-white flex justify-center items-center text-center font-bold text-3xl'>Error</div>;
    }
    return <Component />;
};

export default PageLayout;
