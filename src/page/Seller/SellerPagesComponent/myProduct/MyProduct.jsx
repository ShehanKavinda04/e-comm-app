// src/components/MyProducts.jsx
import React, { useState } from 'react';
import ProductTable from './ProductTable';
import EditProductModal from './EditProductModal';
import ViewProductModal from './ViewProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';

import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct, deleteProduct, fetchSellerStats } from '../../../../Store/ReduxSlice/sellerSlice';

const MyProducts = ({ triggerAddProduct, onAddProductHandled }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.seller);

  // Load products if empty (initial load)
  React.useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchSellerStats());
    }
  }, [dispatch, products]);

  const [filter, setFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  React.useEffect(() => {
    if (triggerAddProduct) {
      setEditingProduct({ name: '', price: 0, stock: 0, status: 'Processing', image: '' });
      setIsEditModalOpen(true);
      if (onAddProductHandled) onAddProductHandled();
    }
  }, [triggerAddProduct, onAddProductHandled]);

  const filteredProducts = (products || []).filter((p) =>
    filter === 'All' ? true : p.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-500';
      case 'Shipped': return 'bg-blue-500';
      case 'Delivered': return 'bg-green-500';
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
    if (editingProduct.id) {
      // Edit existing
      dispatch(updateProduct(editingProduct));
    } else {
      // Add new
      const newProduct = {
        ...editingProduct,
        id: Date.now(),
        sold: 0
      };
      dispatch(addProduct(newProduct));
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
    dispatch(deleteProduct(deletingProduct.id));
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex justify-between mx-4 lg:px-20 md:px-10 mb-8">
        <p className="text-black text-3xl font-semibold">My Products</p>
        <div className="flex gap-3">
          {['All', 'Processing', 'Delivered', 'Shipped'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 border-2 cursor-pointer border-black rounded-full transition ${filter === category
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              {category}
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