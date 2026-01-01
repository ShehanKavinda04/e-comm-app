import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cartActions } from '../Store/ReduxSlice/cartSlice';
import { fetchSellerStats } from '../Store/ReduxSlice/sellerSlice'; // Import fetch action

import { getProducts } from '../Services/MockDataService'; // Fallback data

import SEO from '../component/SEO/SEO';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { CategoryItem } from '../component/Product/Product';
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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // For Cash on Delivery
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'; // For Warranty
import ReplayIcon from '@mui/icons-material/Replay'; // For 14 days return
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Footer from '../component/Footer';

const ItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemId: id } = useParams(); // Get ID from URL - Fix parameter name mismatch
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { products: reduxProducts } = useSelector((state) => state.seller);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // If Redux is empty, fetch data
    if (!reduxProducts || reduxProducts.length === 0) {
      dispatch(fetchSellerStats());
    }
  }, [dispatch, reduxProducts]);

  useEffect(() => {
    // 1. Try finding in Redux (Seller Products)
    let foundProduct = reduxProducts.find(p => p.id == id); // Use == for loose string/number match

    // 2. If not found, try Static Mock Data (Standard Products from Home/Product Page)
    if (!foundProduct) {
      const staticProducts = getProducts();
      foundProduct = staticProducts.find(p => p.id == id);
    }

    // 3. Fallback / Default Data Structure
    if (foundProduct) {
      setProduct({
        id: foundProduct.id,
        title: foundProduct.title || foundProduct.name || 'Product Title',
        price: Number(foundProduct.price) || 0,
        originalPrice: Number(foundProduct.originalPrice) || Number(foundProduct.price) * 1.1 || 0, // Mock original
        discount: foundProduct.discount || '-10%',
        rating: foundProduct.rating || 4.5,
        brand: foundProduct.brand || 'Generic',
        // Handle Images: Ensure array and enrich for premium look if only one image exists
        images: (() => {
          let baseImages = foundProduct.images || (foundProduct.image ? [foundProduct.image] : []) || (foundProduct.imgUrl ? [foundProduct.imgUrl] : ['https://via.placeholder.com/500']);
          if (baseImages.length === 1) {
            const title = (foundProduct.title || foundProduct.name || '').toLowerCase();
            if (title.includes('laptop') || title.includes('hp') || title.includes('macbook')) {
              return [...baseImages,
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=800&auto=format&fit=crop'
              ];
            } else if (title.includes('iphone') || title.includes('phone') || title.includes('samsung') || title.includes('headphones')) {
              return [...baseImages,
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1583394838336-acd977730f90?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop'
              ];
            }
            return [...baseImages, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop'];
          }
          return baseImages;
        })(),
        colors: foundProduct.colors || [], // Preserve if exists
        description: foundProduct.description || 'No description available.',
        fullDescription: foundProduct.fullDescription || foundProduct.description || 'No detailed description available.',
        specifications: foundProduct.specifications || [],
        sellerName: foundProduct.seller || (foundProduct.sellerName) || 'TECHNOVA Official Store',
        sellerRatings: foundProduct.sellerRatings || '92%',
        shipOnTime: foundProduct.shipOnTime || '100%',
        chatResponse: foundProduct.chatResponse || '88%'
      });

      // 4. Find Related Products
      const allProducts = getProducts();
      const related = allProducts.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 8);
      setRelatedProducts(related);

      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      } else {
        setSelectedColor(null);
      }
    } else {
      // Fallback for demo if absolutely nothing found (or navigating directly)
      setProduct({
        id: 'YOGA_MAT_001',
        title: 'Yoga Mat Non Slip, Durable 4mm EVA Fitness Exercise Mat, Pro Yoga Mats for Women and Men, Workout Mats for Home, Pilates and Floor Exercises with Free Bag',
        price: 1921,
        originalPrice: 2100,
        discount: '-9%',
        rating: 0,
        brand: 'No Brand',
        images: [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1000&auto=format&fit=crop',
        ],
        colors: [],
        sellerName: 'Yoga Pro Official',
        sellerRatings: '95%',
        shipOnTime: '99%',
        chatResponse: '90%'
      });
      setSelectedColor(null);
    }
  }, [id, reduxProducts]);

  // Scroll to top when the product ID changes (e.g. from Related Products)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!product) return <div className='pt-[150px] text-center'>Loading...</div>;

  const handleQuantityChange = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    dispatch(cartActions.addToCart({
      id: product.id,
      title: product.title,
      imgUrl: product.images[0],
      price: product.price,
      quantity: quantity
    }));
    // Could add a toast here
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

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
    // Logic for actual wishlist management could go here (e.g. dispatch to Redux)
  };

  return (
    <div className='bg-gray-100 min-h-screen pt-[120px]'>
      <SEO
        title={product.title.substring(0, 60)}
        description={product.title}
        keywords="yoga mat, fitness, exercise, home workout"
      />
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-10'>

        {/* Breadcrumb Mockup */}
        <div className='text-sm text-gray-500 mb-4 capitalize'>
          Home &gt; {product.category || 'Category'} &gt; {product.subCategory || 'General'} &gt; {product.title.split(' ').slice(0, 2).join(' ')}
        </div>

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
              {/* Play Icon Overlay Mockup */}
              {/* <div className='absolute bottom-4 left-4 bg-black/50 p-2 rounded-full text-white'>
                 <PlayArrowIcon />
               </div> */}
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
              Brand: <span className='text-blue-500 cursor-pointer hover:underline'>{product.brand || 'No Brand'}</span> | <span className='text-blue-500 cursor-pointer hover:underline'>More {product.category || 'Electronics'} from {product.brand || 'No Brand'}</span>
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

            {/* Divider */}
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
                    <p className='text-xs text-gray-500'>Guaranteed by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).getDate()} {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' })}-{new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).getDate()} {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' })}</p>
                  </div>
                </div>
                <span className='text-sm font-medium text-gray-800'>Rs. 286</span>
              </div>

              <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3'>
                  <div className='mt-0.5 border border-gray-300 rounded p-0.5'><LocalShippingOutlinedIcon fontSize="small" className='text-gray-400' /></div>
                  <div>
                    <p className='text-sm font-medium text-gray-800'>Standard Collection Point</p>
                    <p className='text-xs text-gray-500'>Guaranteed by {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getDate()} {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' })}-{new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).getDate()} {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' })}</p>
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

        {/* -------------------- Product Description & Specifications -------------------- */}
        <div className='bg-white p-6 rounded-sm shadow-sm mt-6'>
          <h2 className='text-lg font-bold text-gray-800 mb-6 border-b pb-2'>Product Details</h2>

          <div className='grid lg:grid-cols-2 gap-10'>
            {/* Detailed Description */}
            <div>
              <h3 className='text-md font-semibold text-gray-700 mb-3'>Description</h3>
              <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-line'>
                {product.fullDescription}
              </p>
            </div>

            {/* Specifications Table */}
            <div>
              <h3 className='text-md font-semibold text-gray-700 mb-3'>Specifications</h3>
              <div className='border rounded-sm overflow-hidden'>
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, index) => (
                    <div key={index} className={`flex text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b last:border-0`}>
                      <span className='w-1/3 px-4 py-3 font-medium text-gray-500 border-r'>{spec.label}</span>
                      <span className='w-2/3 px-4 py-3 text-gray-700'>{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <p className='p-4 text-sm text-gray-500 italic text-center'>No specifications available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* -------------------- Related Products Section -------------------- */}
        {relatedProducts.length > 0 && (
          <div className='mt-10'>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='text-2xl font-bold text-gray-800'>Related Products</h2>
                <p className='text-gray-500 text-sm'>You May Also Like</p>
              </div>
              <Link to="/category" className='text-blue-500 font-medium hover:underline text-sm'>View More</Link>
            </div>

            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 }
              }}
              className="related-products-swiper !pb-10"
            >
              {relatedProducts.map((relProduct) => (
                <SwiperSlide key={relProduct.id}>
                  <CategoryItem
                    id={relProduct.id}
                    imgUrl={relProduct.image}
                    name={relProduct.brand}
                    product={relProduct.category}
                    rating={relProduct.rating || 4.5}
                    reviews={`${Math.floor(Math.random() * 100) + 20} reviews`}
                    title={relProduct.title}
                    price={relProduct.price}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default ItemPage;