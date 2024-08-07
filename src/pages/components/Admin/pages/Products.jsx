import React from 'react'
import Header from './Header'
import ProductList from './Products/ProductList'

const Products = () => {
    return (
        <div className='bg-slate-900 h-screen'>
            <Header />
            <ProductList />
        </div>
    )
}

export default Products