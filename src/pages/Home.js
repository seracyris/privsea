import React from 'react'
import About from './components/About';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar'
import Pricing from './components/Pricing';
import Services from './components/Services';
import Terms from './components/Terms';

const Home = () => {
    return (
        <div className='bg-slate-900 text-neutral-100'>
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Pricing />
            <Terms />
            <Footer />
        </div>
    )
}

export default Home