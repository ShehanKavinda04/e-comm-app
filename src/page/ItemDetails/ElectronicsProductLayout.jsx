import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Icons
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ElectronicsProductLayout = ({ product, handleAddToCart, handleBuyNow, quantity, setQuantity }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.title,
                    text: `Check out this ${product.title} on TECHNOVA!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    const handleQuantityChange = (type) => {
        if (type === 'inc') setQuantity(q => q + 1);
        if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
    };

    return (
        <div className='flex flex-col lg:flex-row gap-6 bg-white p-6 rounded-sm shadow-sm'>

            {/* -------------------- Left Column: Images (30%) -------------------- */}
            <div className='lg:w-[30%]'>
                {/* Main Image */}
                <div className='relative mb-4 border border-gray-200 rounded-sm cursor-pointer overflow-hidden'>
                    <img
                        src={product.images[selectedImage]}
                        alt={product.title}
                        className='w-full h-[350px] object-contain'
                    />
                </div>

                {/* Thumbnails Carousel */}
                <div className='w-full'>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={4}
                        navigation
                        className="mySwiper"
                    >
                        {product.images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 border rounded-sm cursor-pointer p-1 mx-auto ${selectedImage === index ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <img src={img} alt="thumb" className='w-full h-full object-contain' />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* -------------------- Middle Column: Product Details (45%) -------------------- */}
            <div className='lg:w-[45%]'>
                <h1 className='text-xl text-gray-800 font-medium leading-snug mb-2'>
                    {product.title}
                </h1>

                {/* Ratings & Share */}
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-center gap-2'>
                        <div className='flex text-yellow-400 text-sm'>
                            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} sx={{ fontSize: 18, color: '#e5e7eb' }} />)}
                        </div>
                        <span className='text-sm text-blue-500 hover:underline cursor-pointer'>No Ratings</span>
                    </div>
                    <div className='flex gap-3 text-gray-400'>
                        <ShareIcon
                            onClick={handleShare}
                            className='cursor-pointer hover:text-blue-500 transition-colors'
                        />
                        <div onClick={toggleWishlist} className="cursor-pointer">
                            {isWishlisted ? (
                                <FavoriteIcon className='text-red-500' />
                            ) : (
                                <FavoriteBorderIcon className='hover:text-red-500 transition-colors' />
                            )}
                        </div>
                    </div>
                </div>

                {/* Brand */}
                <div className='text-sm text-gray-500 mb-6'>
                    Brand: <span className='text-blue-500 cursor-pointer hover:underline'>{product.brand || 'No Brand'}</span> | <span className='text-blue-500 cursor-pointer hover:underline'>More {product.category} from {product.brand || 'No Brand'}</span>
                </div>

                {/* Banner */}
                <div className='w-full bg-orange-500 text-white flex items-center justify-between px-4 py-3 mb-6 relative overflow-hidden'>
                    <div className='z-10'>
                        <p className='text-xs italic'>Check Out the Jingle Sale Deals</p>
                        <p className='font-bold text-lg'>Shop Now!</p>
                    </div>
                    <div className='bg-yellow-300 text-orange-600 px-3 py-1 font-bold transform -rotate-2 shadow-sm z-10'>
                        JINGLE SALE
                    </div>
                    {/* Decorative Circles */}
                    <div className='absolute -right-4 -bottom-4 w-20 h-20 bg-orange-400 rounded-full opacity-50'></div>
                </div>

                {/* Price */}
                <div className='mb-6'>
                    <div className='flex items-baseline gap-2 mb-1'>
                        <span className='text-4xl font-normal text-orange-500'>Rs. {(product.price * quantity).toLocaleString()}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-400'>
                        <span className='line-through'>Rs. {(product.originalPrice * quantity).toLocaleString()}</span>
                        <span className='text-black font-medium'>{product.discount}</span>
                    </div>
                </div>

                {/* Installment Mockup */}
                <div className='flex items-center gap-2 text-sm text-gray-600 mb-6'>
                    <span className='text-gray-400'>Installment</span>
                    <span>📅 Up to 3 months, as low as Rs. {Math.ceil((product.price * quantity) / 3).toLocaleString()} per month.</span>
                </div>

                <hr className='border-gray-200 mb-6' />

                {/* Color Family */}
                {product.colors && product.colors.length > 0 && (
                    <div className='mb-6'>
                        <div className='flex items-center gap-8 mb-2'>
                            <span className='text-gray-500 w-24'>Color Family</span>
                            <span className='text-gray-800 font-medium'>{selectedColor ? selectedColor.name : 'Select Color'}</span>
                        </div>
                        <div className='flex gap-2 pl-[120px]'>
                            {product.colors.map((color, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedColor(color)}
                                    className={`border p-1 cursor-pointer transition-all ${selectedColor && selectedColor.name === color.name
                                        ? 'border-orange-500 ring-1 ring-orange-500'
                                        : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    <img src={color.img} alt={color.name} className='w-8 h-8 object-cover' />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div className='mb-8 flex items-center gap-8'>
                    <span className='text-gray-500 w-24'>Quantity</span>
                    <div className='flex items-center gap-4 pl-2'>
                        <button
                            onClick={() => handleQuantityChange('dec')}
                            className='p-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-sm disabled:opacity-50'
                            disabled={quantity <= 1}
                        >
                            <RemoveIcon fontSize="small" />
                        </button>
                        <span className='w-12 text-center font-bold text-gray-800 text-lg'>{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange('inc')}
                            className='p-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-sm'
                        >
                            <AddIcon fontSize="small" />
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex gap-4'>
                    <button
                        onClick={handleBuyNow}
                        className='flex-1 bg-[#26a5d1] hover:bg-[#1e8db3] text-white font-medium py-3 rounded-sm transition shadow-sm'
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className='flex-1 bg-[#f57224] hover:bg-[#d65e1b] text-white font-medium py-3 rounded-sm transition shadow-sm'
                    >
                        Add to Cart
                    </button>
                </div>

            </div>

            {/* -------------------- Right Column: Sidebar (25%) -------------------- */}
            <div className='lg:w-[25%] bg-gray-50/50 p-2'>
                <div className='bg-gray-50 rounded-sm p-3 mb-4'>
                    <div className='flex justify-between items-center text-xs text-gray-500 mb-2'>
                        <span>Delivery Options</span>
                        <InfoOutlinedIcon fontSize="small" />
                    </div>

                    <div className='flex items-start gap-3 mb-4'>
                        <LocationOnIcon className='text-gray-500 mt-1' fontSize="small" />
                        <div className='text-sm flex-1'>
                            <p className='text-gray-800 font-medium'>Western, Colombo 1-15, Colombo 01 - Fort</p>
                        </div>
                        <span className='text-blue-500 text-xs font-medium cursor-pointer uppercase'>Change</span>
                    </div>

                    <hr className='border-gray-200 mb-3' />

                    <div className='flex justify-between items-start mb-3'>
                        <div className='flex gap-3'>
                            <div className='mt-0.5 border border-gray-300 rounded p-0.5'><LocalShippingOutlinedIcon fontSize="small" className='text-gray-400' /></div>
                            <div>
                                <p className='text-sm font-medium text-gray-800'>Standard</p>
                                <p className='text-xs text-gray-500'>Guaranteed by 3-6 days</p>
                            </div>
                        </div>
                        <span className='text-sm font-medium text-gray-800'>Rs. 286</span>
                    </div>

                    <div className='flex justify-between items-start mb-3'>
                        <div className='flex gap-3'>
                            <div className='mt-0.5 border border-gray-300 rounded p-0.5'><LocalShippingOutlinedIcon fontSize="small" className='text-gray-400' /></div>
                            <div>
                                <p className='text-sm font-medium text-gray-800'>Standard Collection Point</p>
                                <p className='text-xs text-gray-500'>Guaranteed by 2-4 days</p>
                            </div>
                        </div>
                        <span className='text-sm font-medium text-gray-800'>Rs. 138</span>
                    </div>

                    <div className='flex items-center gap-3 mb-2'>
                        <div className='mt-0.5 border border-gray-300 rounded-full p-0.5'><AttachMoneyIcon fontSize="small" className='text-gray-400' /></div>
                        <p className='text-sm text-gray-800'>Cash on Delivery Available</p>
                    </div>
                </div>

                <hr className='border-gray-200 mb-4' />

                <div className='mb-4 px-2'>
                    <div className='flex justify-between items-center text-xs text-gray-500 mb-3'>
                        <span>Return & Warranty</span>
                        <InfoOutlinedIcon fontSize="small" />
                    </div>

                    <div className='flex items-center gap-3 mb-3'>
                        <ReplayIcon className='text-gray-400' fontSize="small" />
                        <p className='text-sm text-gray-800'>Change of Mind</p>
                    </div>

                    <div className='flex items-center gap-3 mb-3'>
                        <ReplayIcon className='text-gray-400' fontSize="small" />
                        <p className='text-sm text-gray-800'>14 days easy return</p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <VerifiedUserOutlinedIcon className='text-gray-400' fontSize="small" />
                        <p className='text-sm text-gray-800'>Warranty not available</p>
                    </div>
                </div>

                <div className='bg-gray-50 p-3 rounded-sm'>
                    <div className='mb-2'>
                        <span className='text-xs text-gray-500'>Sold by</span>
                        <p className='text-base font-medium text-gray-800'>{product.sellerName}</p>
                    </div>

                    <div className='flex gap-4 border-t border-gray-200 pt-3'>
                        <div className='text-center'>
                            <p className='text-xs text-gray-500'>Seller Ratings</p>
                            <p className='text-lg font-bold text-gray-800'>{product.sellerRatings}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-xs text-gray-500'>Ship on Time</p>
                            <p className='text-lg font-bold text-gray-800'>{product.shipOnTime}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-xs text-gray-500'>Chat Response</p>
                            <p className='text-lg font-bold text-gray-800'>{product.chatResponse}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ElectronicsProductLayout;
