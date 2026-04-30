
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../Store/ReduxSlice/cartSlice';
import { addToBackendCart, updateBackendCartQuantity } from '../Services/cartSyncService';
import { toggleWishlistBackend, getUserWishlist } from '../Services/wishlistService'; 
import { toast } from 'react-hot-toast';
import { AuthContext } from '../Contexts/AuthContext'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import api from '../Services/api'; // Use centralized api service
import 'swiper/css';
import 'swiper/css/navigation';

// Components
import SEO from '../component/SEO/SEO';
import Footer from '../component/Footer';
import StandardProductLayout from './ItemDetails/StandardProductLayout';
import { CategoryItem } from '../component/Product/Product';

const ItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemId: id } = useParams();
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setProduct(null);
      try {
        const response = await api.get(`/products/${id}`);
        const foundProduct = response.data;

        if (foundProduct) {
          const mainImage = foundProduct.imageFilename 
            ? `/api/uploads/${foundProduct.imageFilename}` 
            : 'https://placehold.co/500x600?text=No+Image';
          
          setProduct({
            id: foundProduct.id,
            title: foundProduct.name || 'Product Title',
            price: Number(foundProduct.price) || 0,
            originalPrice: Number(foundProduct.price) * 1.1 || 0,
            discount: '-10%',
            rating: foundProduct.avgRating || 4.5,
            brand: foundProduct.brandName || 'Generic',
            category: foundProduct.categoryName || 'General',
            images: [mainImage, mainImage, mainImage, mainImage],
            colors: [],
            description: foundProduct.description || 'No description available.',
            fullDescription: foundProduct.description || 'No detailed description available.',
            specifications: [],
            sellerName: 'TECHNOVA Official Store',
            sellerRatings: '92%',
            shipOnTime: '100%',
            chatResponse: '88%'
          });

          // Check if already in wishlist
          if (user) {
            try {
              const currentWishlist = await getUserWishlist();
              const exists = currentWishlist.some(item => (item.productId || item.id) === foundProduct.id);
              setIsWishlisted(exists);
            } catch (err) {
              console.error('Error checking wishlist status:', err);
            }
          }

          // Fetch related products
          const relRes = await api.get(`/products/category/${foundProduct.categoryId}`);
          const relData = relRes.data;
          const related = relData.filter(p => p.id !== foundProduct.id).slice(0, 8).map(r => ({
            ...r,
            imgUrl: r.imageFilename ? `/api/uploads/${r.imageFilename}` : 'https://placehold.co/500x600?text=No+Image',
            name: r.brandName,
            product: r.categoryName,
            title: r.name,
            price: r.price
          }));
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };

    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [id, user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!product) return <div className='pt-[150px] text-center'>Loading...</div>;

  const handleAddToCart = () => {
    dispatch(cartActions.addToCart({
      id: product.id,
      title: product.title,
      imgUrl: product.images[0],
      price: product.price,
      quantity: quantity
    }));
    
    const existingItem = cartItems.find(i => i.id === product.id);
    if (existingItem) {
      updateBackendCartQuantity(product.id, existingItem.quantity + quantity);
    } else {
      addToBackendCart(product.id, quantity);
    }
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please log in to use Wishlist');
      return;
    }
    
    try {
      const res = await toggleWishlistBackend(product.id);
      setIsWishlisted(res.favorited);
      
      if (res.favorited) {
        toast.success('Added to Wishlist!');
      } else {
        toast.success('Removed from Wishlist!');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist. Please try again.');
    }
  };

  return (
    <div className='bg-white min-h-screen pt-4'>
      <SEO
        title={product.title.substring(0, 60)}
        description={product.title}
        keywords={product.category}
      />

      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <div className='text-sm text-gray-500 mb-4 capitalize'>
          Home &gt; {product.category} &gt; {product.title.split(' ').slice(0, 2).join(' ')}
        </div>

        {/* Layout */}
        <StandardProductLayout
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          toggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className='mt-16 border-t pt-10'>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='text-2xl font-bold text-gray-800'>Related Products</h2>
                <p className='text-gray-500 text-sm'>You May Also Like</p>
              </div>
              <Link to="/products" className='text-blue-500 font-medium hover:underline text-sm'>View More</Link>
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
                    imgUrl={relProduct.imgUrl}
                    name={relProduct.name}
                    product={relProduct.product}
                    rating={relProduct.rating || 4.5}
                    reviews="12 reviews"
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