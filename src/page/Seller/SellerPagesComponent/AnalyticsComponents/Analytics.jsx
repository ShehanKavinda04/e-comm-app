import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import KPICard from "./KPICard";
import SalesChart from "./SalesChart";
import ProductPerformanceChart from "./ProductPerformanceChart";
import CategoryPieChart from "./CategoryPieChart";
import AdCampaignStats from "./AdCampaignStats";
import { fetchAnalyticsReport } from "../../../../Store/ReduxSlice/analyticsSlice";
import { AuthContext } from "../../../../Contexts/AuthContext";
import axios from "axios";

const Analytics = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const { report, isLoading, isError, message } = useSelector((state) => state.analytics);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState(7);
  const [categories, setCategories] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch Categories for Filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Initial and Filter-based Fetch
  const triggerFetch = () => {
    if (user?.token) {
      const categoryId = selectedCategory === "all" ? null : selectedCategory;
      dispatch(fetchAnalyticsReport({ 
        days: dateRange, 
        categoryId: categoryId, 
        token: user.token 
      }));
    }
  };

  useEffect(() => {
    triggerFetch();
  }, [dispatch, dateRange, selectedCategory, user?.token]);

  // Automatic Refresh Fallback (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-refreshing analytics data...");
      triggerFetch();
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch, dateRange, selectedCategory, user?.token]);

  // Real-time synchronization via SSE
  useEffect(() => {
    if (!user?.token) return;

    // Use environment-aware URL or fallback to relative
    const sseUrl = window.location.hostname === 'localhost' 
      ? "http://localhost:8082/api/ads/stream" 
      : "/api/ads/stream";

    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener("ANALYTICS_UPDATE", (event) => {
      console.log("Real-time Analytics Update Received at:", new Date().toLocaleTimeString());
      triggerFetch();
    });

    eventSource.onerror = (err) => {
      console.error("SSE connection error", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch, dateRange, selectedCategory, user?.token]);

  const handleExportPDF = async () => {
    if (!user?.token) return;
    setIsExporting(true);
    try {
      const categoryId = selectedCategory === "all" ? "" : selectedCategory;
      const response = await axios.get("/api/analytics/seller/report/pdf", {
        params: {
          days: dateRange,
          categoryId: categoryId || undefined
        },
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Using a numeric timestamp to match the requested format: [timestamp].pdf
      link.setAttribute('download', `${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF", err);
      // Optional: Add toast notification here if available
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (!report) return;
    const headers = [
      "Date",
      "Sales Amount",
      "Product Name",
      "Units Sold",
      "Category",
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Summary Metrics\n";
    csvContent += `Total Revenue,${report.summary.totalRevenue}\n`;
    csvContent += `Total Orders,${report.summary.totalOrders}\n`;
    csvContent += `Avg Order Value,${report.summary.avgOrderValue}\n\n`;

    csvContent += "Sales Trend\n";
    csvContent += "Date,Amount\n";
    report.salesTrend.forEach((row) => {
      csvContent += `${row.name},${row.value}\n`;
    });
    csvContent += "\n";

    csvContent += "Top Products\n";
    csvContent += "Product Name,Units\n";
    report.topProducts.forEach((row) => {
      csvContent += `${row.name},${row.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `technova_analytics_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 })
      .format(val)
      .replace('LKR', 'Rs.');
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-6">{message || "We couldn't load your analytics data."}</p>
          <button 
            onClick={triggerFetch}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-gray-500">Updating live data...</p>
          </div>
        </div>
      )}

      {/* Top Filter Bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={60}>Last 60 Days</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors shadow-sm ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          )}
          {isExporting ? 'Generating...' : 'Export PDF Report'}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(report.summary.totalRevenue)}
          trendValue={report.summary.totalRevenue > 0 ? "+--%" : null}
          isPositive={true}
        />
        <KPICard
          title="Total Orders"
          value={report.summary.totalOrders.toLocaleString()}
          trendValue={report.summary.totalOrders > 0 ? "+--%" : null}
          isPositive={true}
        />
        <KPICard
          title="Avg. Order Value"
          value={formatCurrency(report.summary.avgOrderValue)}
          trendValue={null}
        />
        <KPICard
          title="Conversion Rate"
          value={`${report.summary.conversionRate}%`}
          trendValue={report.summary.conversionRate > 0 ? "+--%" : null}
          isPositive={true}
        />
      </div>

      {/* Main Charts Section */}
      <div className="flex flex-col gap-6">
        <SalesChart
          data={report.salesTrend}
          totalRevenue={report.summary.totalRevenue}
          days={dateRange}
        />
        <ProductPerformanceChart data={report.topProducts} days={dateRange} />
        <CategoryPieChart
          data={report.categoryDistribution}
          totalRevenue={report.summary.totalRevenue}
        />
        <AdCampaignStats data={report.adPerformance} />
      </div>
    </div>
  );
};

export default Analytics;
