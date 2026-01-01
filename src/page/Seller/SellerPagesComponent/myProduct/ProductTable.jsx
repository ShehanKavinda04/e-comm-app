import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProductTable = ({ products, getStatusColor, onEdit, onView, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-center">Stock</th>
                        <th className="px-6 py-4 text-center">Sold</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="font-medium text-gray-900 line-clamp-2 max-w-[200px]" title={product.name}>
                                        {product.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">
                                Rs. {product.price.toLocaleString()}
                            </td>
                            <td className={`px-6 py-4 text-center font-medium ${product.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                {product.stock}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700">
                                {product.sold}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(product.status)}`}>
                                    {product.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onView(product)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                                        title="View"
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition"
                                        title="Edit"
                                    >
                                        <BorderColorIcon fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(product)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                        title="Delete"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {products.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No products found.
                </div>
            )}
        </div>
    );
};

export default ProductTable;
