import React, { useEffect, useState } from 'react';
import { Briefcase, Users, Package, ShoppingBasket, Check, X, Eye } from 'lucide-react';
import { formatCurrency } from '../../../Utils/formatters';
import api from '../../../Services/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Overview = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    totalProducts: 0,
    ordersToday: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      const data = response.data;
      
      setMetrics({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        activeUsers: data.activeUsers || 0,
        totalProducts: data.totalProducts || 0,
        ordersToday: data.ordersToday || 0
      });
      
      setRecentOrders(data.recentOrders || []);
      setPendingApprovals(data.pendingApprovals || []);
      setChartData(data.chartData || []);
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchData();

    // SSE Real-time Synchronization
    const sseUrl = "http://localhost:8082/api/ads/stream"; // Full URL to ensure connection
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener("DASHBOARD_UPDATE", (event) => {
      console.log("Admin Overview: Real-time update received via SSE");
      fetchData();
    });

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error for Admin Overview:", err);
      eventSource.close();
    };

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const handleApprove = async (id) => {
    setIsActionLoading(true);
    try {
      await api.put(`/admin/sellers/applications/${id}/approve`);
      fetchData();
    } catch (error) {
      console.error("Failed to approve seller application:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setIsActionLoading(true);
    try {
      await api.put(`/admin/sellers/applications/${id}/reject`);
      fetchData();
    } catch (error) {
      console.error("Failed to reject seller application:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await api.get(`/admin/sellers/applications/${id}`);
      setSelectedApp(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch application details:", error);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes('ship')) return 'bg-blue-100 text-blue-600';
    if (s?.includes('deliver')) return 'bg-green-100 text-green-600';
    if (s?.includes('pend')) return 'bg-orange-100 text-orange-600';
    if (s?.includes('cancel') || s?.includes('reject')) return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
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
              {pendingApprovals.length > 0 && (
                <span className="bg-[#cc5e4d] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingApprovals.length}
                </span>
              )}
            </div>
            <div className="w-8 h-8 bg-[#cc5e4d] rounded-full flex items-center justify-center text-white font-bold">!</div>
          </div>
          <div className="space-y-0 text-gray-800">
            {pendingApprovals.map((item, index) => (
              <React.Fragment key={item.id}>
                <ApprovalItem
                  title={item.title}
                  subtitle={item.subtitle}
                  onView={() => handleView(item.id)}
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

      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedApp} 
      />
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

const ApprovalItem = ({ title, subtitle, showActions = true, onView, onApprove, onReject }) => (
  <div className="flex justify-between items-center py-4">
    <div>
      <h4 className="font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={onView}
        className="text-black hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        title="View Details"
      >
        <Eye className="w-5 h-5" />
      </button>
      {showActions && (
        <>
          <button
            onClick={onApprove}
            className="text-green-500 hover:text-green-600 bg-green-100 rounded-full p-1.5 transition-colors"
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onReject}
            className="text-red-500 hover:text-red-600 bg-red-100 rounded-full p-1.5 transition-colors"
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  </div>
);

const DetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden transform transition-all scale-100 font-sans">
        <div className="bg-[#cc5e4d] px-6 py-4 flex justify-between items-center">
          <h3 className="text-white text-xl font-bold">Seller Application Detail</h3>
          <button onClick={onClose} className="text-white opacity-80 hover:opacity-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Applicant Name</label>
              <p className="text-gray-900 font-semibold">{data.fullName}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
              <div className="mt-1">
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">{data.status}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Name</label>
              <p className="text-gray-900 font-semibold">{data.businessName}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Type</label>
              <p className="text-gray-900 font-semibold">{data.businessType || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
              <p className="text-gray-900 font-semibold font-mono">{data.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
              <p className="text-gray-900 font-semibold">{data.phone}</p>
            </div>
          </div>
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Physical Address</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1 text-sm leading-relaxed">{data.physicalAddress}</p>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Description</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1 text-sm leading-relaxed italic">
              "{data.businessDescription || 'No description provided.'}"
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;