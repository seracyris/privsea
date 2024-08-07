import Dashboard from './pages/Dashboard'
import Services from './pages/Services'
import Settings from './pages/Settings'
import Help from './pages/Help'
import Products from './pages/Products'
import React from 'react';

const componentMap = {
    Dashboard: Dashboard,
    Services: Services,
    Products: Products,
    Settings: Settings,
    Help: Help
}

const PageLayout = (props) => {
    const { page } = props;
    const Component = componentMap[page];
    if (!Component) {
        return <div className='w-screen h-screen bg-slate-900 flex justify-center items-center text-center font-bold text-3xl'>Error</div>;
    }
    return <Component />;
};

export default PageLayout;
