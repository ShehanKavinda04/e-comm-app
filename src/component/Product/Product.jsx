import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStats } from '../../Store/ReduxSlice/sellerSlice';
import SEO from '../SEO/SEO';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const brands = [
  { name: 'Apple', icon: 'https://cdn-icons-png.flaticon.com/512/0/747.png' },
  { name: 'Samsung', icon: 'https://cdn-icons-png.flaticon.com/512/5969/5969116.png' },
  { name: 'HP', icon: 'https://cdn-icons-png.flaticon.com/512/882/882731.png' },
  { name: 'Lenovo', icon: 'https://cdn-icons-png.flaticon.com/512/882/882749.png' },
  { name: 'OnePlus', icon: 'https://cdn-icons-png.flaticon.com/512/882/882745.png' },
  { name: 'Dell', icon: 'https://cdn-icons-png.flaticon.com/512/882/882725.png' },
  { name: 'Asus', icon: 'https://cdn-icons-png.flaticon.com/512/882/882713.png' },
  { name: 'Acer', icon: 'https://cdn-icons-png.flaticon.com/512/882/882703.png' },
];

const Product = () => {
  const dispatch = useDispatch();
  const { products: reduxProducts } = useSelector((state) => state.seller);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortOption, setSortOption] = useState('Featured');

  useEffect(() => {
    if (reduxProducts.length === 0) {
      dispatch(fetchSellerStats());
    }
  }, [dispatch, reduxProducts.length]);

  useEffect(() => {
    // Transform Redux data (or Mock data if Redux is empty initially)
    // Force robust mock data for demonstration
    const mockData = [
      { id: 1, name: 'iPhone 13 Pro', brand: 'Apple', category: 'Mobile Parts', price: 150000, imgUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=60' },
      { id: 2, name: 'Samsung S21 Screen', brand: 'Samsung', category: 'Mobile Parts', price: 45000, imgUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500&q=60' },
      { id: 3, name: 'HP Pavilion Battery', brand: 'HP', category: 'Laptop Parts', price: 8500, imgUrl: 'https://images.unsplash.com/photo-1588872657578-13eb22fd5525?auto=format&fit=crop&w=500&q=60' },
      { id: 4, name: 'Lenovo Charger', brand: 'Lenovo', category: 'Laptop Parts', price: 4500, imgUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=60' },
      { id: 5, name: 'OnePlus 9 Back Glass', brand: 'OnePlus', category: 'Mobile Parts', price: 3500, imgUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&w=500&q=60' },
      { id: 6, name: 'Dell Inspecton Screen', brand: 'Dell', category: 'Laptop Parts', price: 12000, imgUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=500&q=60' },
      { id: 7, name: 'Asus ROG Fan', brand: 'Asus', category: 'Laptop Parts', price: 6000, imgUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60' },
      { id: 8, name: 'Acer Aspire Keyboard', brand: 'Acer', category: 'Laptop Parts', price: 2500, imgUrl: 'https://images.unsplash.com/photo-1587829741301-3b7c8f2595f9?auto=format&fit=crop&w=500&q=60' },
      { id: 9, name: 'iPhone 14 Case', brand: 'Apple', category: 'Accessories', price: 1500, imgUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=500&q=60' },
      { id: 10, name: 'Samsung A52 Display', brand: 'Samsung', category: 'Mobile Parts', price: 25000, imgUrl: 'https://images.unsplash.com/photo-1610945265064-f3947e27ddb9?auto=format&fit=crop&w=500&q=60' }
    ];

    const sourceData = mockData; // FORCE MOCK DATA IGNORE REDUX

    // If Redux is still loading/empty, we might want to show nothing or a loader
    // But for now let's map it.

    const transformedProducts = sourceData.map((item, index) => {
      // Mock Brand assignment if missing or generic, to ensure "Shop by Brand" has data
      const mockBrands = ['Apple', 'Samsung', 'HP', 'Lenovo', 'OnePlus', 'Dell', 'Asus', 'Acer'];
      const assignedBrand = item.brand || item.name || mockBrands[index % mockBrands.length];

      return {
        ...item,
        imgUrl: item.image || item.imgUrl, // Handle both key names
        name: assignedBrand, // Use the assigned brand as the "name" for filtering
        product: item.category || 'Product',
        title: item.title || item.name || `${assignedBrand} Product ${index + 1}`, // Ensure title exists
        rating: item.rating || (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
        reviews: item.reviews || `${Math.floor(Math.random() * 200) + 50} reviews`,
        price: item.price !== undefined ? Number(item.price) : (index + 1) * 15000 + 5000
      };
    });

    setProducts(transformedProducts);
    setFilteredProducts(transformedProducts);

    // ... categories and brands extraction logic ...
    const uniqueCategories = ['All Products', ...new Set(transformedProducts.map(item => item.product))];
    setCategories(uniqueCategories);

    const uniqueBrands = ['All Brands', ...new Set(transformedProducts.map(item => item.name))];
    setBrandsList(uniqueBrands);

  }, [reduxProducts]);

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
        <button className="absolute bottom-3 right-3 text-gray-600 hover:text-red-500 transition">
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