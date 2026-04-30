import React, { useEffect, useState, useMemo } from 'react';
import { Search, MoreVertical, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../Services/api';

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
  const ITEMS_PER_PAGE = 8;
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    seller: '',
    status: '',
    dateSort: 'newest'
  });

  const fetchData = async () => {
    try {
      const [metricsRes, productsRes] = await Promise.all([
        api.get('/admin/products/metrics'),
        api.get('/admin/products')
      ]);
      setMetrics(metricsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Failed to fetch products management data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // SSE Real-time Synchronization
    const sseUrl = "http://localhost:8082/api/ads/stream";
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener("DASHBOARD_UPDATE", (event) => {
      console.log("Admin Product Management: Real-time update received");
      fetchData();
    });

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error for Admin Product Management:", err);
      eventSource.close();
    };

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/products/${id}/approve`);
      fetchData(); // Refresh list after approval
    } catch (error) {
      console.error("Failed to approve product:", error);
    }
  };

  const handleFlag = async (id) => {
    try {
      await api.put(`/admin/products/${id}/flag`);
      fetchData();
    } catch (error) {
      console.error("Failed to flag product:", error);
    }
  };

  const uniqueCategories = useMemo(() => [...new Set(products.map(p => p.categoryName || 'N/A'))], [products]);
  const uniqueSellers = useMemo(() => [...new Set(products.map(p => p.sellerName || 'Unknown'))], [products]);
  const uniqueStatuses = useMemo(() => [...new Set(products.map(p => p.status))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.sellerName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category ? product.categoryName === filters.category : true;
      const matchesSeller = filters.seller ? product.sellerName === filters.seller : true;
      const matchesStatus = filters.status ? product.status === filters.status : true;

      return matchesSearch && matchesCategory && matchesSeller && matchesStatus;
    }).sort((a, b) => {
      if (filters.dateSort === 'newest') return (b.id || 0) - (a.id || 0); // Using ID for recency since dateAdded might not be in DTO yet
      if (filters.dateSort === 'oldest') return (a.id || 0) - (b.id || 0);
      return 0;
    });
  }, [products, searchTerm, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getStatusBadge = (product) => {
    const status = product.status;
    switch (status) {
      case 'PENDING_APPROVAL':
        return (
          <button 
            onClick={() => handleApprove(product.id)}
            className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-xs font-bold px-3 py-1 rounded-full transition-colors"
          >
            Approve
          </button>
        );
      case 'ACTIVE':
        return <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">Approved</span>;
      case 'INACTIVE':
        return <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">Inactive</span>;
      case 'FLAGGED':
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
        <KPICard title="Total Products" value={(metrics.totalProducts || 0).toLocaleString()} valueColor="text-black" />
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
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(product => (
            <ProductCard
              key={product.id}
              image={product.imageFilename ? `/api/uploads/${product.imageFilename}` : 'https://via.placeholder.com/150'}
              title={product.name}
              seller={product.sellerName}
              category={product.categoryName}
              stock={product.stock}
              statusBadge={getStatusBadge(product)}
              onFlag={() => handleFlag(product.id)}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">No products found matching filters.</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > ITEMS_PER_PAGE && (
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
      )}
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

const ProductCard = ({ image, title, seller, category, stock, statusBadge, onFlag }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <img 
        src={image} 
        alt={title} 
        className="w-20 h-20 rounded-lg object-cover bg-gray-100 border border-gray-200" 
        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">Seller: <span className="text-gray-700 font-medium">{seller}</span></p>
        <p className="text-sm text-gray-500">Category: <span className="text-gray-700 font-medium">{category}</span>, Stock: <span className={stock <= 0 ? 'text-red-500 font-bold' : 'text-gray-700'}>{stock}</span></p>
        <div className="mt-2 text-black">
          {statusBadge}
          {stock <= 0 && <span className="ml-2 bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button 
        onClick={onFlag}
        className="text-gray-400 hover:text-red-500 transition-colors p-2"
        title="Flag Product"
      >
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  </div>
);

export default ProductManagement;