// src/components/MyProducts.jsx
import React, { useState, useEffect, useContext } from 'react';
import ProductTable from './ProductTable';
import EditProductModal from './EditProductModal';
import ViewProductModal from './ViewProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';

import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProductThunk, deleteProductThunk, fetchSellerProducts, toggleProductStatusThunk } from '../../../../Store/ReduxSlice/sellerSlice';
import { AuthContext } from '../../../../Contexts/AuthContext';

const MyProducts = ({ triggerAddProduct, onAddProductHandled }) => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const { products, isLoading } = useSelector((state) => state.seller);

  // Load products
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchSellerProducts({ token: user.token }));
    }

    // Real-time synchronization via SSE
    if (!user?.token) return;

    let eventSource;
    let retryCount = 0;
    const maxRetries = 5;

    const connectSSE = () => {
      const sseUrl = "/api/ads/stream";
      console.log("MyProducts connecting to SSE at:", sseUrl);
      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener("DASHBOARD_UPDATE", (event) => {
        console.log("Real-time Product Update Received at:", new Date().toLocaleTimeString());
        dispatch(fetchSellerProducts({ token: user.token }));
      });

      eventSource.onerror = (err) => {
        eventSource.close();
        if (retryCount < maxRetries) {
          const timeout = Math.pow(2, retryCount) * 1000;
          setTimeout(connectSSE, timeout);
          retryCount++;
        }
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [dispatch, user?.token]);

  const [filter, setFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (triggerAddProduct) {
      setEditingProduct({ name: '', price: 0, stock: 0, status: 'ACTIVE', image: '' });
      setIsEditModalOpen(true);
      if (onAddProductHandled) onAddProductHandled();
    }
  }, [triggerAddProduct, onAddProductHandled]);

  const filteredProducts = (products || []).filter((p) =>
    filter === 'All' ? true : p.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-red-500';
      case 'DELETED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    const token = user?.token;
    if (!token) return;

    // Prepare data for multipart/form-data (including the image file if selected)
    const productData = {
      name: editingProduct.name,
      price: editingProduct.price,
      stock: editingProduct.stock,
      categoryId: editingProduct.categoryId || 1, // Defaulting for simple audit
      brandId: editingProduct.brandId || 1,       // Defaulting for simple audit
      description: editingProduct.description || "",
      active: editingProduct.status === 'ACTIVE',
      imageFile: editingProduct.imageFile // Expected in EditProductModal
    };

    if (editingProduct.id && typeof editingProduct.id === 'number' && editingProduct.id > 10000000000) {
      // It's a temporary ID from our old logic or a brand new product
      dispatch(createProduct({ token, productData }))
        .then(() => dispatch(fetchSellerProducts({ token })));
    } else if (editingProduct.id) {
      // Edit existing
      dispatch(updateProductThunk({ token, productId: editingProduct.id, productData }))
        .then(() => dispatch(fetchSellerProducts({ token })));
    } else {
      // Add new if no ID at all
      dispatch(createProduct({ token, productData }))
        .then(() => dispatch(fetchSellerProducts({ token })));
    }
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (user?.token && deletingProduct?.id) {
      dispatch(deleteProductThunk({ token: user.token, productId: deletingProduct.id }))
        .then(() => dispatch(fetchSellerProducts({ token: user.token })));
    }
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const handleToggleStatus = (product) => {
    if (user?.token && product?.id) {
      dispatch(toggleProductStatusThunk({ token: user.token, productId: product.id }));
    }
  };

  const getCounts = () => {
    return {
      All: (products || []).length,
      ACTIVE: (products || []).filter(p => p.status === 'ACTIVE').length,
      INACTIVE: (products || []).filter(p => p.status === 'INACTIVE').length
    };
  };

  const counts = getCounts();

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex justify-between mx-4 lg:px-20 md:px-10 mb-8">
        <p className="text-black text-3xl font-semibold">My Products</p>
        <div className="flex gap-3">
          {['All', 'ACTIVE', 'INACTIVE'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 border-2 cursor-pointer border-black rounded-full transition flex items-center gap-2 ${filter === category
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              <span>{category}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === category ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'}`}>
                {counts[category]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="lg:px-20 md:px-10 mb-10">
        <ProductTable
          products={filteredProducts}
          getStatusColor={getStatusColor}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Modals */}
      <EditProductModal
        editingProduct={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        onInputChange={handleInputChange}
        onSave={handleSave}
      />

      <ViewProductModal
        product={viewingProduct}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        getStatusColor={getStatusColor}
      />

      <DeleteConfirmModal
        product={deletingProduct}
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingProduct(null);
        }}
      />
    </div>
  );
};

export default MyProducts;