import React, { useEffect, useState, useMemo } from 'react';
import { Search, MoreVertical, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductMetrics, getProducts } from '../../../Services/MockDataService';

const ProductManagement = () => {
  const [metrics, setMetrics] = useState({
    pendingApprovals: 0,
    totalProducts: 0,
    outOfStock: 0,
    flaggedProducts: 0
  });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [filters, setFilters] = useState({
    category: '',
    seller: '',
    status: '',
    dateSort: 'newest'
  });

  useEffect(() => {
    // Fetch metrics
    const metricsData = getProductMetrics();
    setMetrics(metricsData);

    // Fetch products
    const productsData = getProducts();
    setProducts(productsData);
  }, []);

  const uniqueCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const uniqueSellers = useMemo(() => [...new Set(products.map(p => p.seller))], [products]);
  const uniqueStatuses = useMemo(() => [...new Set(products.map(p => p.status))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category ? product.category === filters.category : true;
      const matchesSeller = filters.seller ? product.seller === filters.seller : true;
      const matchesStatus = filters.status ? product.status === filters.status : true;

      return matchesSearch && matchesCategory && matchesSeller && matchesStatus;
    }).sort((a, b) => {
      if (filters.dateSort === 'newest') return new Date(b.dateAdded) - new Date(a.dateAdded);
      if (filters.dateSort === 'oldest') return new Date(a.dateAdded) - new Date(b.dateAdded);
      return 0;
    });
  }, [products, searchTerm, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-[#fadcb6] text-[#eca609] text-xs font-bold px-3 py-1 rounded-full">Pending</span>;
      case 'Approved':
        return <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">Approve</span>;
      case 'Out of Stock':
        return <span className="bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>;
      case 'Flagged':
        return <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Flagged</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Pending Approvals" value={metrics.pendingApprovals} valueColor="text-[#cc5e4d]" />
        <KPICard title="Total Products" value={metrics.totalProducts.toLocaleString()} valueColor="text-black" />
        <KPICard title="Out of Stock" value={metrics.outOfStock} valueColor="text-[#cc5e4d]" />
        <KPICard title="Flagged Products" value={metrics.flaggedProducts} valueColor="text-[#eca609]" />
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 text-black">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by product name, seller"
          className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <FilterDropdown
          label="Categories"
          options={uniqueCategories}
          value={filters.category}
          onChange={(val) => handleFilterChange('category', val)}
        />
        <FilterDropdown
          label="Seller"
          options={uniqueSellers}
          value={filters.seller}
          onChange={(val) => handleFilterChange('seller', val)}
        />
        <FilterDropdown
          label="Status"
          options={uniqueStatuses}
          value={filters.status}
          onChange={(val) => handleFilterChange('status', val)}
        />
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
            value={filters.dateSort}
            onChange={(e) => handleFilterChange('dateSort', e.target.value)}
          >
            <option value="newest">Date Added (Newest)</option>
            <option value="oldest">Date Added (Oldest)</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4 mb-8">
        {filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(product => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            seller={product.seller}
            category={product.category}
            stock={product.stock}
            statusBadge={getStatusBadge(product.status)}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500">No products found matching filters.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="hover:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex gap-4">
          {Array.from({ length: Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
            <span
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`cursor-pointer ${currentPage === page ? 'text-red-500 font-bold' : 'hover:text-black'}`}
            >
              {page}
            </span>
          ))}
        </div>
        <button
          onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), p + 1))}
          disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
          className="hover:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, valueColor }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-gray-800 font-semibold mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
  </div>
);

const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="relative">
    <select
      className={`appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer ${value ? 'border-red-500 bg-red-50' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
  </div>
);

const ProductCard = ({ image, title, seller, category, stock, statusBadge }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <img src={image} alt={title} className="w-20 h-20 rounded-lg object-cover bg-black" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">Seller: {seller}</p>
        <p className="text-sm text-gray-500">Category: {category}, Stock:{stock}</p>
        <div className="mt-2">
          {statusBadge}
        </div>
      </div>
    </div>
    <button className="text-gray-900 hover:text-gray-600 self-start md:self-center">
      <MoreVertical className="w-6 h-6" />
    </button>
  </div>
);

export default ProductManagement;