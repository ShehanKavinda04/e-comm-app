import React, { useState, useEffect, useMemo } from "react";
import { Eye, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../../../Services/MockDataService";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const data = getAllOrders();
    setOrders(data);
  }, []);

  const filters = [
    "All",
    "Pending",
    "Delivered",
    "Shipped",
    "Canceled",
    "Disputed",
  ];

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  const currentItems = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResolveOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: "Resolved" };
      }
      return order;
    });
    setOrders(updatedOrders);
    alert(`Order #${orderId} has been marked as Resolved.`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 justify-end">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition-colors
              ${
                activeFilter === filter
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-black hover:bg-gray-100"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {currentItems.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onResolve={handleResolveOrder}
          />
        ))}
        {currentItems.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No orders found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-600 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="hover:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex gap-4">
          <span className="text-red-500 font-bold">{currentPage}</span>
          <span className="text-gray-500">
            of {Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1}
          </span>
        </div>
        <button
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(Math.ceil(filteredOrders.length / ITEMS_PER_PAGE), p + 1)
            )
          }
          disabled={
            currentPage === Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) ||
            filteredOrders.length === 0
          }
          className="hover:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onResolve }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#fadcb6] text-[#eca609]";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Canceled":
        return "bg-pink-100 text-pink-600";
      case "Disputed":
        return "bg-pink-100 text-pink-600"; // Match design red tone
      case "Resolved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleResolve = () => {
    onResolve(order.id);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200 relative">
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-6">
        <span
          className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="flex justify-between items-end mt-4">
        {/* Left Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            #{order.id.replace("ORD-", "")}
          </h3>
          <p className="text-sm font-semibold text-gray-800 mb-1">
            {order.customerName}
          </p>
          <p className="text-sm text-gray-500">
            {order.date} - Rs.{order.amount.toFixed(2)}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex gap-3">
          {order.status === "Disputed" ? (
            <>
              <Link
                to={`/admin/order/${order.id}`}
                className="flex items-center gap-2 px-4 py-2 border border-black rounded-lg text-black font-medium hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>
              <button
                onClick={handleResolve}
                className="px-4 py-2 bg-[#E13626] text-white rounded-lg font-medium hover:bg-red-700"
              >
                Resolve
              </button>
            </>
          ) : (
            <Link
              to={`/admin/order/${order.id}`}
              className="flex items-center gap-2 px-4 py-2 border border-black rounded-lg text-black font-medium hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
