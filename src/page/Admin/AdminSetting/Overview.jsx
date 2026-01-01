import React, { useEffect, useState } from 'react';
import { Briefcase, Users, Package, ShoppingBasket, Check, X, Eye } from 'lucide-react';
import { getFinancialMetrics, getRecentOrders, getPendingApprovals } from '../../../Services/MockDataService';
import { formatCurrency } from '../../../Utils/formatters';

const Overview = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    activeUsers: 0,
    totalProducts: 0,
    ordersToday: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    const data = getFinancialMetrics();
    setMetrics(data);

    // Fetch recent orders
    const orders = getRecentOrders();
    setRecentOrders(orders);

    // Fetch pending approvals
    const approvals = getPendingApprovals();
    setPendingApprovals(approvals);
  }, []);

  const handleApprove = (id) => {
    console.log("Approved item:", id);
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
  };

  const handleReject = (id) => {
    console.log("Rejected item:", id);
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shipping': return 'bg-blue-100 text-blue-600';
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'Pending': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon={<Briefcase className="w-8 h-8 text-white" />}
        />
        <KPICard
          title="Active Users"
          value={metrics.activeUsers}
          icon={<Users className="w-8 h-8 text-white" />}
        />
        <KPICard
          title="Total Products"
          value={metrics.totalProducts}
          icon={<Package className="w-8 h-8 text-white" />}
        />
        <KPICard
          title="Orders Today"
          value={metrics.ordersToday}
          icon={<ShoppingBasket className="w-8 h-8 text-white" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-gray-900 font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map(order => (
              <OrderCard
                key={order.id}
                id={order.id}
                name={order.customerName}
                price={formatCurrency(order.amount)}
                status={order.status}
                statusColor={getStatusColor(order.status)}
              />
            ))}
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">Pending Approvals</h2>
              <span className="bg-[#cc5e4d] text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </div>
            <div className="w-8 h-8 bg-[#cc5e4d] rounded-full flex items-center justify-center text-white font-bold">!</div>
          </div>
          <div className="space-y-0 text-gray-800">
            {pendingApprovals.map((item, index) => (
              <React.Fragment key={item.id}>
                <ApprovalItem
                  title={item.title}
                  subtitle={item.subtitle}
                  onApprove={() => handleApprove(item.id)}
                  onReject={() => handleReject(item.id)}
                />
                {index < pendingApprovals.length - 1 && <div className="border-b border-gray-200 my-2"></div>}
              </React.Fragment>
            ))}
            {pendingApprovals.length === 0 && <p className="text-gray-500 text-sm py-4">No pending approvals.</p>}
          </div>
          {/* Visual fix: The image shows lines strictly between items or bottom. I will use a divide-y approach or manual borders. */}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon }) => (
  <div className="bg-[#f05728] rounded-lg p-5 flex items-center justify-between text-white shadow-md relative overflow-hidden">
    <div>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
      {icon}
    </div>
  </div>
);

const OrderCard = ({ id, name, price, status, statusColor }) => (
  <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white hover:shadow-md transition-shadow">
    <div>
      <h3 className="font-bold text-gray-800">{id}</h3>
      <p className="text-sm text-gray-600">{name}</p>
    </div>
    <div className="text-right">
      <p className="font-bold text-gray-800 mb-1">{price}</p>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
  </div>
);

const ApprovalItem = ({ title, subtitle, showActions = true, onApprove, onReject }) => (
  <div className="flex justify-between items-center py-4">
    <div>
      <h4 className="font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3">
      <button className="text-black hover:text-gray-600">
        <Eye className="w-5 h-5" />
      </button>
      {showActions && (
        <>
          <button
            onClick={onApprove}
            className="text-green-500 hover:text-green-600 bg-green-100 rounded-full p-1"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onReject}
            className="text-red-500 hover:text-red-600 bg-red-100 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  </div>
);

export default Overview;