import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Icons
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const StandardProductLayout = ({ product, handleAddToCart, handleBuyNow, quantity, setQuantity, toggleWishlist, isWishlisted }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : null);

    const handleQuantityChange = (type) => {
        if (type === 'inc') setQuantity(q => q + 1);
        if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
    };

    const handleInputChange = (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= 1) setQuantity(val);
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 bg-white'>
            <div className='flex flex-col lg:flex-row gap-12 items-start'>
                {/* Left: Image Gallery */}
                <div className='lg:w-1/2 w-full'>
                    <div className='mb-6 flex justify-center items-center bg-yellow-400/10 rounded-lg p-10 h-[500px]'>
                        {/* Used a subtle yellow tint bg to nod to the reference image, but kept it light */}
                        <img
                            src={product.images[selectedImage]}
                            alt={product.title}
                            className='max-h-full max-w-full object-contain drop-shadow-xl mix-blend-multiply'
                        />
                    </div>
                    {/* Thumbnails */}
                    <div className='flex gap-4 justify-start'>
                        {product.images.map((img, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-20 h-20 p-2 cursor-pointer border rounded-md transition-all bg-gray-50 ${selectedImage === index ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <img src={img} alt="thumb" className='w-full h-full object-contain mix-blend-multiply' />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Details */}
                <div className='lg:w-1/2 w-full pt-2'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>{product.title}</h1>
                    <p className='text-sm text-gray-500 mb-4'>SKU: {product.id}</p>

                    <div className='flex items-baseline gap-3 mb-4'>
                        <span className='text-2xl font-bold text-gray-900'>Rs. {(product.price * quantity).toLocaleString()}</span>
                        {product.originalPrice && <span className='text-sm text-gray-500 line-through'>Rs. {(product.originalPrice * quantity).toLocaleString()}</span>}
                    </div>

                    {/* Rating */}
                    <div className='flex items-center gap-2 mb-6'>
                        <div className='flex text-yellow-500'>
                            {[1, 2, 3, 4].map(i => <StarIcon key={i} fontSize='small' />)}
                            <StarIcon fontSize='small' className='text-yellow-500' style={{ opacity: 0.5 }} /> {/* Half star simulation */}
                        </div>
                        <span className='text-sm text-gray-600 font-medium'>4.5 (120 reviews)</span>
                    </div>

                    <p className='text-gray-600 mb-8 leading-relaxed'>
                        {product.description || 'Experience premium sound quality and industry-leading noise cancellation with these wireless headphones. Perfect for music lovers and frequent travelers.'}
                    </p>

                    {/* Colors - Text Buttons */}
                    <div className='mb-6'>
                        <p className='text-sm font-bold text-gray-800 mb-2'>Color:</p>
                        <div className='flex gap-3'>
                            {product.colors && product.colors.length > 0 ? (
                                product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${selectedColor && selectedColor.name === color.name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                                    >
                                        {color.name}
                                    </button>
                                ))
                            ) : (
                                // Fallback Mock Colors similar to image
                                <>
                                    <button
                                        onClick={() => setSelectedColor({ name: 'Black' })}
                                        className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${selectedColor?.name === 'Black' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                                        Black
                                    </button>
                                    <button
                                        onClick={() => setSelectedColor({ name: 'Silver' })}
                                        className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${selectedColor?.name === 'Silver' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                                        Silver
                                    </button>
                                    <button
                                        onClick={() => setSelectedColor({ name: 'Blue' })}
                                        className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${selectedColor?.name === 'Blue' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                                        Blue
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className='mb-8'>
                        <p className='text-sm font-bold text-gray-800 mb-2'>Quantity:</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleQuantityChange('dec')}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 focus:outline-none"
                                disabled={quantity <= 1}
                            >
                                <RemoveIcon fontSize="small" className="text-gray-600" />
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={handleInputChange}
                                className='w-16 h-10 text-center border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none'
                            />
                            <button
                                onClick={() => handleQuantityChange('inc')}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 focus:outline-none"
                            >
                                <AddIcon fontSize="small" className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-4'>
                        <button
                            onClick={handleAddToCart}
                            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded shadow-sm transition-colors font-medium'
                        >
                            <ShoppingCartIcon fontSize="small" />
                            Add to Cart
                        </button>
                        <button
                            onClick={toggleWishlist}
                            className={`flex items-center gap-2 border px-6 py-3 rounded shadow-sm transition-colors font-medium ${isWishlisted ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-300 hover:border-gray-400 text-gray-700'}`}
                        >
                            {isWishlisted ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                            {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StandardProductLayout;
