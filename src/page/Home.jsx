import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Ads from '../component/ads/Ads';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import Footer from '../component/Footer';
import Category from '../component/Category/Category';
import { CategoryItem } from '../component/Product/Product'; // Import reused component
import { getProducts } from '../Services/MockDataService'; // Import data service
import SEO from '../component/SEO/SEO';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const data = getProducts();
    // Use data directly, but limit to 4 for featured
    // Ensure properties match what CategoryItem expects
    const transformedProducts = data.slice(0, 4).map(item => ({
      ...item,
      imgUrl: item.image, // Ensure compatibility if component uses imgUrl
      product: item.category,
      rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
      reviews: `${Math.floor(Math.random() * 200) + 50} reviews`,
    }));
    setFeaturedProducts(transformedProducts);
  }, []);

  const formatPrice = (price) => price.toLocaleString();

  return (
    <div className='pt-[100px] w-full min-h-screen bg-white'>
      <SEO
        title="Home"
        description="Premium Mobile & Laptop Parts directly from TechNova. Authentic, fast delivery, and expert support."
        keywords="mobile parts, laptop parts, tech accessories, authentic parts, fast delivery"
      />

      {/* -------------------- Hero Section -------------------- */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6'>
              Premium Mobile <br /> & Laptop Parts
            </h1>
            <p className='text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0'>
              Find authentic mobile spare parts and computer accessories with guaranteed compatibility. Professional quality, trusted by thousands.
            </p>
            <button
              onClick={() => navigate('/category/fitness/yoga-mat')}
              className='px-8 py-3 rounded-full border-2 border-red-400 text-red-400 font-semibold text-lg hover:bg-red-50 transition'
            >
              Shop Now
            </button>
          </div>
          <div className='flex-1 w-full max-w-md md:max-w-full'>
            <Ads />
          </div>
        </div>
      </div>

      {/* -------------------- Shop by Category -------------------- */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center md:text-left'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Shop by Category</h2>
        <p className='text-gray-500 mb-10'>Find exactly what you need for your device</p>
        <Category />
      </div>

      {/* -------------------- Featured Products -------------------- */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20'>
        <div className='flex justify-between items-end mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Featured Products</h2>
            <p className='text-gray-500'>Hand-picked products with best quality and value</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className='flex items-center text-red-500 border border-red-500 px-4 py-1 rounded-full text-sm font-medium hover:bg-red-50 transition'
          >
            View All <ChevronRightIcon fontSize="small" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((item, index) => (
            <CategoryItem key={index} {...item} price={formatPrice(item.price)} />
          ))}
        </div>
      </div>

      {/* -------------------- Why Choose Us -------------------- */}
      <div className='bg-[#D32F2F] py-16 mb-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-white mb-2'>Why Choose Us?</h2>
          <p className='text-white/80 mb-12'>We provide the best simple platform for both customers and sellers</p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Card 1 */}
            <div className='bg-white rounded-xl p-8 flex flex-col items-center shadow-lg'>
              <div className='mb-4 text-gray-800'>
                <VerifiedUserOutlinedIcon sx={{ fontSize: 40 }} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Authentic Parts</h3>
              <p className='text-gray-500 text-sm'>
                Every product is verified for authenticity with strict quality checks
              </p>
            </div>

            {/* Card 2 */}
            <div className='bg-white rounded-xl p-8 flex flex-col items-center shadow-lg'>
              <div className='mb-4 text-gray-800'>
                <LocalShippingOutlinedIcon sx={{ fontSize: 40 }} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Fast Delivery</h3>
              <p className='text-gray-500 text-sm'>
                Same-day shipping for orders before noon, safe packaging
              </p>
            </div>

            {/* Card 3 */}
            <div className='bg-white rounded-xl p-8 flex flex-col items-center shadow-lg'>
              <div className='mb-4 text-gray-800'>
                <SupportAgentOutlinedIcon sx={{ fontSize: 40 }} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Expert Support</h3>
              <p className='text-gray-500 text-sm'>
                Technical support and compatibility assistance from experts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- Testimonials -------------------- */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>What Our Customers Say</h2>
        <p className='text-gray-500 mb-10'>Trusted by professionals and tech enthusiasts worldwide</p>

        <div className='space-y-6'>
          {/* Review 1 */}
          <div className='bg-white border border-red-200 rounded-full p-4 flex items-center shadow-sm'>
            <div className='mr-4'>
              <AccountCircleIcon sx={{ fontSize: 48, color: '#333' }} />
            </div>
            <div className='text-left flex-1'>
              <h4 className='font-bold text-gray-900 leading-none'>Jacob Jones</h4>
              <p className='text-xs text-gray-400'>Tech Enthusiast</p>
              <p className='text-sm text-gray-600 mt-1 line-clamp-1'>
                "The best platform for genuine spare parts. Got my display within 2 days!"
              </p>
            </div>
            <div className='flex gap-1 text-yellow-400'>
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
            </div>
          </div>

          {/* Review 2 */}
          <div className='bg-white border border-red-200 rounded-full p-4 flex items-center shadow-sm'>
            <div className='mr-4'>
              <AccountCircleIcon sx={{ fontSize: 48, color: '#333' }} />
            </div>
            <div className='text-left flex-1'>
              <h4 className='font-bold text-gray-900 leading-none'>Sarah Williams</h4>
              <p className='text-xs text-gray-400'>Mobile Technician</p>
              <p className='text-sm text-gray-600 mt-1 line-clamp-1'>
                "Excellent quality parts and amazing customer service. Highly recommended!"
              </p>
            </div>
            <div className='flex gap-1 text-yellow-400'>
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
              <StarIcon fontSize="small" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home;