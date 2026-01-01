import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Category from '../component/Category/Category';
import Footer from '../component/Footer';
import SEO from '../component/SEO/SEO';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const CatalogPage = () => {
    return (
        <div className='pt-[120px] bg-gray-50 min-h-screen'>
            <SEO
                title="Catalog"
                description="Browse all product categories at TechNova. Find mobile displays, laptops, headphones, and more."
            />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>
                {/* Breadcrumbs */}
                <div className='text-sm text-gray-500 mb-8 flex items-center gap-1'>
                    <Link to="/" className='hover:text-red-500'>Home</Link>
                    <ChevronRightIcon sx={{ fontSize: 16 }} />
                    <span className='text-gray-800 font-medium'>Catalog</span>
                </div>

                <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-100'>
                    <div className='text-center mb-12'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Product Catalog</h1>
                        <p className='text-gray-500 max-w-2xl mx-auto'>
                            Explore our wide range of authentic spare parts and high-quality tech accessories.
                            Choose a category to find specific components for your device.
                        </p>
                    </div>

                    <div className='py-10 border-t border-gray-50'>
                        <h2 className='text-xl font-bold text-gray-800 mb-8 text-center uppercase tracking-wider'>Shop by Category</h2>
                        <Category />
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default CatalogPage;
