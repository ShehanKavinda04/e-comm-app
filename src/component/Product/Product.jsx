import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStats, fetchSellerProducts } from '../../Store/ReduxSlice/sellerSlice';
import { AuthContext } from '../../Contexts/AuthContext';
import api from '../../Services/api';
import SEO from '../SEO/SEO';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toggleWishlistBackend } from '../../Services/wishlistService';
import { toast } from 'react-hot-toast';

const brands = [
  { name: 'Apple', icon: 'https://cdn-icons-png.flaticon.com/512/0/747.png' },
  { name: 'Samsung', icon: 'https://cdn-icons-png.flaticon.com/512/5969/5969116.png' },
  { name: 'Sony', icon: 'https://cdn-icons-png.flaticon.com/512/5969/5969176.png' },
  { name: 'OnePlus', icon: 'https://cdn-icons-png.flaticon.com/512/10416/10416955.png' },
  { name: 'Dell', icon: 'https://cdn-icons-png.flaticon.com/512/882/882725.png' },
  { name: 'HP', icon: 'https://cdn-icons-png.flaticon.com/512/882/882731.png' },
  { name: 'Lenovo', icon: 'https://cdn-icons-png.flaticon.com/512/882/882749.png' },
  { name: 'TechNova', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921251.png' },
];

const Product = () => {
  const dispatch = useDispatch();
  const { products: reduxProducts } = useSelector((state) => state.seller);
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortOption, setSortOption] = useState('Featured');

  useEffect(() => {
    const fetchGeneralProducts = async () => {
      try {
        const response = await api.get('/products');
        const data = response.data;
        
        // Transformer for Backend Data
        const transformedProducts = data.map((item, index) => {
          return {
            ...item,
            imgUrl: item.imageFilename ? `/api/uploads/${item.imageFilename}` : 'https://placehold.co/500x600?text=No+Image',
            name: item.brandName || 'Generic', 
            product: item.categoryName || 'Product',
            title: item.name || `Product ${item.id}`,
            rating: item.avgRating || (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1),
            reviews: `${item.reviewCount || 0} reviews`,
            price: item.price !== undefined ? Number(item.price) : 0
          };
        });

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);

        const uniqueCategories = ['All Products', ...new Set(transformedProducts.map(item => item.product))];
        setCategories(uniqueCategories);

        const uniqueBrands = ['All Brands', ...new Set(transformedProducts.map(item => item.name))];
        setBrandsList(uniqueBrands);

      } catch (err) {
        console.error("Failed to fetch products for gallery:", err);
      }
    };

    fetchGeneralProducts();
    
    // Still fetch stats if owner to keep dashboard sync
    if (user?.token) {
      dispatch(fetchSellerStats({ token: user.token }));
    }
  }, [dispatch, user?.token]);

  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'All Products') {
      result = result.filter(item => item.product === selectedCategory);
    }

    // Filter by Brand
    if (selectedBrand !== 'All Brands') {
      result = result.filter(item =>
        (item.name || '').toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Sort
    if (sortOption === 'Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'High to Low') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedBrand, sortOption, products]);

  // Format price for display helper
  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  const handleBrandClick = (brandName) => {
    setSelectedBrand(brandName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='bg-white min-h-screen py-10 px-4 md:px-8 pt-[120px]'>
      <SEO
        title="All Products"
        description="Browse our wide selection of mobile and laptop parts. Find best deals on authentic spare parts."
        keywords="buy mobile parts, laptop screens, batteries, chargers, online electronics shop"
      />

      {/* -------------------- Header & Filter -------------------- */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800">All Products</h2>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 focus:outline-none"
          >
            {brandsList.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 focus:outline-none"
          >
            <option value="Featured">Featured</option>
            <option value="Low to High">Price: Low to High</option>
            <option value="High to Low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((item, index) => (
          <CategoryItem key={index} {...item} price={formatPrice(item.price)} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>

      {/* Shop by Brand */}
      <div className="mt-24 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Shop by Brand</h2>
        <p className="text-gray-500 mt-2 mb-10">Find exactly what you need for your device</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {brands.map((brand, index) => {
            // Calculate dynamic count
            const count = products.filter(item =>
              (item.name || '').toLowerCase() === brand.name.toLowerCase()
            ).length;

            return (
              <div
                key={index}
                onClick={() => handleBrandClick(brand.name)}
                className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition cursor-pointer bg-white group h-40"
              >
                <img src={brand.icon} alt={brand.name} className="h-12 w-auto mb-4 opacity-70 group-hover:opacity-100 transition" />
                <h3 className="font-bold text-gray-800">{brand.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{count} Items</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Product;

export const CategoryItem = ({ id, imgUrl, name, product, rating, reviews, title, price }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    // Construct path: /category/{categoryName}/{productId}
    // Ensure category is URL friendly (basic check) or use existing value
    const categoryPath = product ? product.toLowerCase().replace(/\s+/g, '-') : 'general';
    navigate(`/category/${categoryPath}/${id}`);
  };

  return (
    <div
      onClick={handleItemClick}
      className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-none w-full max-w-[280px] mx-auto flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full h-[220px] bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
        <img src={imgUrl} alt={name} className="max-h-[180px] object-contain drop-shadow-lg" />
        <button 
          onClick={async (e) => {
            e.stopPropagation(); // Prevent navigating to product details
            try {
              const res = await toggleWishlistBackend(id);
              if (res.favorited) {
                toast.success('Added to Wishlist!');
              } else {
                toast.success('Removed from Wishlist!');
              }
            } catch (err) {
              toast.error('Please log in to use Wishlist');
            }
          }}
          className="absolute bottom-3 right-3 text-gray-600 hover:text-red-500 transition z-10"
        >
          <FavoriteBorderIcon fontSize="small" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs text-gray-500 font-medium">{name}</span>
          <span className="text-xs text-gray-400">{product}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 h-10">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <StarIcon sx={{ fontSize: 16, color: '#FCD34D' }} />
          <span className="text-xs font-bold text-gray-700">{rating}</span>
          <span className="text-xs text-gray-400">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <p className="text-lg font-bold text-black mb-3">Rs. {price}</p>
        </div>
      </div>
    </div>
  );
};