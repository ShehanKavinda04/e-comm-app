import React, { useState, useEffect } from 'react';
import step4Is from '../../../img/step4.png';
import CreateCampaignModal from './AdvertisementComponents/CreateCampaignModal';

import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStats } from '../../../Store/ReduxSlice/sellerSlice';

const Advertisement = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(fetchSellerStats());
  }, [dispatch]);

  const [campaigns, setCampaigns] = useState([]);

  // Sync Redux state to local state when loaded
  useEffect(() => {
    if (stats.adCampaigns) {
      setCampaigns(stats.adCampaigns);
    }
  }, [stats.adCampaigns]);

  const [budget, setBudget] = useState({
    total: 52000,
    spent: 2000
  });

  const [showFundModal, setShowFundModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [fundAmount, setFundAmount] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleAddFunds = (e) => {
    e.preventDefault();
    const amount = parseFloat(fundAmount);
    if (amount > 0) {
      setBudget(prev => ({
        ...prev,
        total: prev.total + amount
      }));
      setFundAmount("");
      setShowFundModal(false);
    }
  };

  const toggleCampaign = (id) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, active: !c.active, status: !c.active ? "Active" : "Pause" } : c
    ));
  };

  const handleCreateCampaign = (newCampaignData) => {
    const newCampaign = {
      ...newCampaignData,
      id: campaigns.length + 1,
      image: step4Is // Force placeholder for now
    };
    setCampaigns([newCampaign, ...campaigns]);
  };

  return (
    <div className="py-6 p-10 lg:px-20 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Impressions"
          value={isLoading ? "..." : stats.totalImpressions ? stats.totalImpressions.toLocaleString() : "0"}
          change="+12.5%"
          isPositive={true}
        />
        <StatCard
          title="Total Clicks"
          value={isLoading ? "..." : stats.totalClicks ? stats.totalClicks.toLocaleString() : "0"}
          change="+5.2%"
          isPositive={true}
        />
        <StatCard
          title="Click -Through Rate"
          value={isLoading ? "..." : stats.ctr ? `${stats.ctr}%` : "0%"}
          change="-2.1%"
          isPositive={false}
        />
        <StatCard
          title="Total Conversions"
          value={isLoading ? "..." : stats.totalConversions ? stats.totalConversions.toLocaleString() : "0"}
          change="+10.3%"
          isPositive={true}
        />
      </div>

      {/* Ad Budget Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Ad Budget</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Budget</p>
            <p className="font-semibold text-gray-800">Rs. {budget.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Spent</p>
            <p className="font-semibold text-gray-800">Rs. {budget.spent.toLocaleString()}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500 mb-1">Remaining</p>
            <p className="font-semibold text-gray-800">Rs. {(budget.total - budget.spent).toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6 relative">
          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min((budget.spent / budget.total) * 100, 100)}%` }}></div>
        </div>

        <button
          onClick={() => setShowFundModal(true)}
          className="bg-[#E65525] hover:bg-[#d0461e] text-white px-6 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer"
        >
          Add Funds
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-125">
          <input
            type="text"
            placeholder="Search ad campaigns"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-300 bg-gray-50"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div className="flex gap-2 items-center">
          {["All", "Active", "Pause", "Ended"].map((status) => (
            <FilterButton
              key={status}
              label={status}
              active={filterStatus === status}
              onClick={() => setFilterStatus(status)}
            />
          ))}
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm cursor-pointer whitespace-nowrap"
          >
            + Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {campaigns.filter(c => filterStatus === "All" || c.status === filterStatus).map(campaign => (
          <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
              {/* Phone mockup placeholder */}
              <img src={campaign.image} alt={campaign.title} className="h-full object-contain drop-shadow-lg transform rotate-[-5deg]" />
              <img src={campaign.image} alt={campaign.title} className="h-[90%] object-contain drop-shadow-lg transform rotate-[10deg] absolute right-8 bottom-2 opacity-80" />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800">{campaign.title}</h3>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={campaign.active}
                    onChange={() => toggleCampaign(campaign.id)}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E65525]"></div>
                </label>
              </div>

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${campaign.active
                  ? 'bg-green-100 text-green-600'
                  : 'bg-orange-100 text-orange-500'
                  }`}>
                  {campaign.status}
                </span>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Clicks</p>
                    <p className="font-semibold text-gray-800 text-sm">{campaign.clicks}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Impressions</p>
                    <p className="font-semibold text-gray-800 text-sm">{campaign.impressions}</p>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Showing details for: ${campaign.title}\nClicks: ${campaign.clicks}\nImpressions: ${campaign.impressions}`)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Show Details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Funds Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Funds to Budget</h3>
            <form onSubmit={handleAddFunds}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFundModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E65525] hover:bg-[#d0461e] text-white rounded-lg font-medium transition-colors"
                >
                  Add Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCampaign}
      />
    </div>
  );
};

const StatCard = ({ title, value, change, isPositive }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <h3 className="text-xl font-bold text-gray-800 mb-1">{value}</h3>
    <div className="flex items-center">
      <span className={`text-xs font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'} {change}
      </span>
    </div>
  </div>
);

const FilterButton = ({ label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${active
      ? 'bg-gray-800 text-white border-gray-800'
      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}>
    {label}
  </button>
);

export default Advertisement;