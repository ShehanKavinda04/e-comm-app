import React, { useEffect, useState } from "react";
import KPICard from "./KPICard";
import SalesChart from "./SalesChart";
import ProductPerformanceChart from "./ProductPerformanceChart";
import CategoryPieChart from "./CategoryPieChart";
import AdCampaignStats from "./AdCampaignStats";
import {
  getFinancialMetrics,
  getSalesOverTime,
  getTopProducts,
  getCategorySales,
} from "../../../../Services/MockDataService";

const Analytics = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dateRange, setDateRange] = useState(7); // Default to 7 days

  useEffect(() => {
    // Simulate API call
    setMetrics(getFinancialMetrics(dateRange, selectedCategory));
    setSalesData(getSalesOverTime(dateRange, selectedCategory));
    setTopProducts(getTopProducts(dateRange, selectedCategory));
    // Category sales usually is all time or matched range, let's keep it static or match if needed
    setCategoryData(getCategorySales());
    setLoading(false);
  }, [dateRange, selectedCategory]);

  if (loading)
    return <div className="p-10 text-center">Loading Analytics...</div>;

  const handleExportCSV = () => {
    // 1. Define Headers
    const headers = [
      "Date",
      "Day",
      "Sales Amount",
      "Top Product",
      "Category",
      "Units Sold",
    ];

    console.log("Exporting CSV with headers:", headers);
    // Since arrays might be different lengths, we'll map the longer one or just dump separate sections.
    // For a simple report, let's list Sales Over Time first.

    let csvContent = "data:text/csv;charset=utf-8,";

    // Section 1: Summary Metrics
    csvContent += "Summary Metrics\n";
    csvContent += `Total Revenue,${metrics.totalRevenue}\n`;
    csvContent += `Total Orders,${metrics.totalOrders}\n`;
    csvContent += `Avg Order Value,${metrics.avgOrderValue}\n\n`;

    // Section 2: Sales Over Time
    csvContent += "Sales Over Time\n";
    csvContent += "Date,Day,Sales Amount\n";
    salesData.forEach((row) => {
      // Mocking a full date since we only have day name in chart data for now,
      // but in real app we'd have full date. Using row.name as placeholder.
      csvContent += `-,${row.name},${row.value}\n`;
    });
    csvContent += "\n";

    // Section 3: Top Products
    csvContent += "Top Products\n";
    csvContent += "Product Name,Units Sold\n";
    topProducts.forEach((row) => {
      csvContent += `${row.name},${row.value}\n`;
    });
    csvContent += "\n";

    // Section 4: Category Sales
    csvContent += "Category Sales\n";
    csvContent += "Category,Revenue\n";
    categoryData.forEach((row) => {
      csvContent += `${row.name},${row.value}\n`;
    });

    // 3. Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tech_titans_analytics_report.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
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
            <option value="All Categories">All Categories</option>
            <option value="Mobile Parts">Mobile Parts</option>
            <option value="Laptop Parts">Laptop Parts</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          Export Report
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Revenue"
          value={`Rs.${metrics.totalRevenue.toLocaleString()}`}
          trendValue="+12.5%"
          isPositive={true}
        />
        <KPICard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          trendValue="+4.5%"
          isPositive={true}
        />
        <KPICard
          title="Avg. Order Value"
          value={`Rs.${metrics.avgOrderValue.toLocaleString()}`}
          trendValue="-2.3%"
          isPositive={false}
        />
        <KPICard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          trendValue="+0.1%"
          isPositive={true}
        />
      </div>

      {/* Main Charts Section */}
      <div className="flex flex-col gap-6">
        {/* Sales Over Time (Full Width) */}
        <SalesChart
          data={salesData}
          totalRevenue={metrics.totalRevenue}
          days={dateRange}
        />

        {/* Top Product (Full Width) */}
        <ProductPerformanceChart data={topProducts} />

        {/* Sales by Category (Full Width) */}
        <CategoryPieChart
          data={categoryData}
          totalRevenue={metrics.totalRevenue}
        />

        {/* Ad Campaign Performance (Full Width) */}
        <AdCampaignStats />
      </div>
    </div>
  );
};

export default Analytics;
