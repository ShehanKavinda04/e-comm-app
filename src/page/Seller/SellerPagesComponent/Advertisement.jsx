import React, { useState, useEffect } from 'react';
import step4Is from '../../../img/step4.png';
import CreateCampaignModal from './AdvertisementComponents/CreateCampaignModal';
import EditCampaignModal from './AdvertisementComponents/EditCampaignModal';
import ViewDetailsModal from './AdvertisementComponents/ViewDetailsModal';
import DeleteConfirmationModal from './AdvertisementComponents/DeleteConfirmationModal';
import AdDropdown from './AdvertisementComponents/AdDropdown';

import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStats } from '../../../Store/ReduxSlice/sellerSlice';
import axios from 'axios';
import { AuthContext } from '../../../Contexts/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Advertisement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Auth Check: Redirect to login if user session is missing
  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
    }
  }, [user, navigate]);

  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchSellerStats({ token: user.token }));
    }
  }, [dispatch, user?.token]);

  const [campaigns, setCampaigns] = useState([]);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch campaigns from MySQL backend
  const fetchCampaigns = async () => {
    if (!user || !user.token) return;
    setIsCampaignsLoading(true);
    try {
      const response = await axios.get("/api/ads/seller", {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 6000 // Optimized timeout for 6s responsiveness
      });
      // Sort by ID descending so newest is always at the top
      const sortedData = Array.isArray(response.data) ? response.data.sort((a, b) => b.id - a.id) : [];

      // Map backend fields to frontend expectations
      const mappedData = sortedData.map(ad => {
        let imagePath = ad.creativeUrl || step4Is;
        // Ensure path starts with / if it's a relative path to public
        if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/') && !imagePath.startsWith('data:')) {
          imagePath = `/${imagePath}`;
        }

        // Calculate CTR real-time
        const impressions = ad.impressions || 0;
        const clicks = ad.clicks || 0;
        const ctrValue = impressions > 0 ? (clicks / impressions) * 100 : 0;

        return {
          ...ad,
          active: ad.status === 'RUNNING' || ad.status === 'APPROVED',
          image: imagePath,
          ctr: ctrValue.toFixed(2) // Sending formatted CTR
        };
      });
      setCampaigns(mappedData);
      return mappedData;
    } catch (error) {
      console.error("Error fetching seller campaigns:", error.message);
      // Fallback: If it's a timeout or 403, we still want to stop the loading state
      if (error.code === 'ECONNABORTED') {
        console.warn("Campaign fetch timed out after 3s");
      }
      setCampaigns([]); // Clear or keep old data? Better to clear to show error state if needed
    } finally {
      setIsCampaignsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  const [showFundModal, setShowFundModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [fundAmount, setFundAmount] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real-time updates via SSE
  useEffect(() => {
    fetchCampaigns();
    dispatch(fetchSellerStats());

    let eventSource;
    const connectSSE = () => {
      console.log("Connecting to SSE: /api/ads/stream");
      eventSource = new EventSource("/api/ads/stream");

      eventSource.addEventListener("AD_UPDATE", () => {
        console.log("Real-time update received: Refreshing ad dashboard...");
        fetchCampaigns();
        if (user?.token) {
          dispatch(fetchSellerStats({ token: user.token }));
        }
      });

      eventSource.onopen = () => {
        console.log("SSE Connection to /api/ads/stream established.");
      };

      eventSource.onerror = (err) => {
        console.error("SSE Connection failed, retrying in 5s...", err);
        eventSource.close();
        setTimeout(connectSSE, 5000); // Robust retry logic
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [user?.token]);

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

  const toggleCampaign = async (id) => {
    if (!user || !user.token) return;
    
    const campaign = campaigns.find(c => c.id === id);
    if (campaign && (campaign.status === 'PENDING_REVIEW' || campaign.status === 'REJECTED')) {
      toast.error(`Cannot toggle campaign: This ad is ${campaign.status.replace('_', ' ').toLowerCase()}.`);
      return;
    }

    try {
      await axios.post(`/api/ads/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success("Campaign status updated!");
      fetchCampaigns(); // Immediate refresh after action
    } catch (error) {
      console.error("Error toggling campaign on MySQL:", error);
      const msg = error.response?.data?.message || "Failed to update campaign status.";
      toast.error(msg);
    }
  };

  const handleCreateCampaign = async (newCampaignData) => {
    if (!user || !user.token) return;
    try {
      const payload = {
        title: newCampaignData.title,
        creativeUrl: newCampaignData.creativeUrl,
        landingUrl: "http://localhost:5173",
        pricingModel: "CPC",
        pricePerUnit: 10.0,
        budget: newCampaignData.budget,
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + (newCampaignData.duration || 7) * 86400000).toISOString()
      };

      const response = await axios.post("/api/ads", payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setShowCreateModal(false);
      await fetchCampaigns(); // Immediate refresh
      return response.data;
    } catch (error) {
      console.error("Error adding campaign to MySQL:", error);
      throw error; // Propagate to modal for UI feedback
    }
  };

  const handleUpdateCampaign = async (id, updatedData) => {
    if (!user || !user.token) return;
    try {
      await axios.put(`/api/ads/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await fetchCampaigns(); // Immediate refresh
    } catch (error) {
      console.error("Error updating campaign on MySQL:", error);
      throw error;
    }
  };

  const handleDeleteCampaign = async () => {
    const id = selectedCampaignId;
    console.log(`handleDeleteCampaign triggered for ID: ${id}`);
    if (!user || !user.token || !id) {
      console.error("Deletion failed: Missing user session or campaign ID");
      return;
    }
    
    setIsDeleting(true);
    try {
      console.log(`Sending DELETE request for campaign ${id}...`);
      const response = await axios.delete(`/api/ads/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log(`DELETE response received for ${id}:`, response.status);
      toast.success("Campaign deleted successfully");
      setShowDeleteModal(false);
      setSelectedCampaignId(null);
      await fetchCampaigns(); // Immediate refresh
      dispatch(fetchSellerStats({ token: user.token }));
    } catch (error) {
      console.error("Error deleting campaign from MySQL:", error.response || error);
      const errorMsg = error.response?.data?.message || "Failed to delete campaign. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (campaign) => {
    setSelectedCampaignId(campaign.id);
    setShowDeleteModal(true);
  };

  const trackInteraction = async (id, type) => {
    if (!user || !user.token) return;
    try {
      await axios.post(`/api/ads/${id}/${type}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success(`Mock ${type} recorded! Dashboard will update in real-time.`);
    } catch (error) {
      console.error(`Error tracking ${type}:`, error);
      toast.error(`Failed to track ${type}. Ensure the ad is RUNNING.`);
    }
  };

  const openEditModal = (campaign) => {
    setSelectedCampaignId(campaign.id);
    setShowEditModal(true);
  };

  const openViewModal = (campaign) => {
    setSelectedCampaignId(campaign.id);
    setShowViewModal(true);
  };

  // Map Filter Labels to Backend Statuses and Search Term
  const filterAds = (ads) => {
    if (!ads) return [];
    
    // First apply status filter
    let filtered = ads;
    if (filterStatus === "Active") filtered = ads.filter(ad => ad.status === 'RUNNING' || ad.status === 'APPROVED');
    else if (filterStatus === "Pause") filtered = ads.filter(ad => ad.status === 'PAUSED' || ad.status === 'DRAFT');
    else if (filterStatus === "Ended") filtered = ads.filter(ad => ad.status === 'ENDED' || ad.status === 'REJECTED');

    // Then apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.title?.toLowerCase().includes(term) || 
        ad.id?.toString().includes(term)
      );
    }
    
    return filtered;
  };

  // Derive aggregate budget stats from campaigns in real-time
  const totalBudget = campaigns.reduce((acc, c) => acc + (parseFloat(c.budget) || 0), 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + (parseFloat(c.spent) || 0), 0);
  const remainingFunds = totalBudget - totalSpent;
  const spendPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="py-6 p-10 lg:px-20 bg-gray-50 min-h-screen font-sans text-gray-800">
      <Toaster position="top-center" />
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Impressions"
          value={isLoading ? "..." : stats.totalImpressions ? stats.totalImpressions.toLocaleString() : "0"}
          change={stats.impressionsChange || "0%"}
          isPositive={stats.impressionsPositive}
        />
        <StatCard
          title="Total Clicks"
          value={isLoading ? "..." : stats.totalClicks ? stats.totalClicks.toLocaleString() : "0"}
          change={stats.clicksChange || "0%"}
          isPositive={stats.clicksPositive}
        />
        <StatCard
          title="Click -Through Rate"
          value={isLoading ? "..." : stats.ctr ? `${stats.ctr}%` : "0%"}
          change={stats.ctrChange || "0%"}
          isPositive={stats.ctrPositive}
        />
        <StatCard
          title="Total Conversions"
          value={isLoading ? "..." : stats.totalConversions ? stats.totalConversions.toLocaleString() : "0"}
          change={stats.conversionsChange || "0%"}
          isPositive={stats.conversionsPositive}
        />
      </div>

      {/* Ad Budget Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Ad Budget</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Budget</p>
            <p className="font-semibold text-gray-800">Rs. {totalBudget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Spent</p>
            <p className="font-semibold text-gray-800">Rs. {totalSpent.toLocaleString()}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500 mb-1">Remaining</p>
            <p className="font-semibold text-gray-800">Rs. {remainingFunds.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6 relative">
          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min(spendPercentage, 100)}%` }}></div>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      <div className="min-h-[400px]">
        {isCampaignsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 animate-pulse">Fetching your campaigns...</p>
          </div>
        ) : filterAds(campaigns).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterAds(campaigns).map(campaign => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {/* Using a clean image rendering without multiple overlays to avoid broken icon issues */}
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f"; }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${campaign.active ? 'bg-green-500' : 'bg-orange-500'}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800 truncate" title={campaign.title}>{campaign.title}</h3>

                    {/* Toggle Switch */}
                    <label className={`relative inline-flex items-center ${campaign.status === 'PENDING_REVIEW' || campaign.status === 'REJECTED' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={campaign.active}
                        onChange={() => toggleCampaign(campaign.id)}
                        disabled={campaign.status === 'PENDING_REVIEW' || campaign.status === 'REJECTED'}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E65525]"></div>
                    </label>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${campaign.active
                      ? 'bg-green-100 text-green-600'
                      : 'bg-orange-100 text-orange-500'
                      }`}>
                      {campaign.active ? 'Running' : 'Paused'}
                    </span>
                  </div>

                    <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                        <div className="group relative">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide flex items-center gap-1">
                            Clicks
                            <button 
                              onClick={(e) => { e.stopPropagation(); trackInteraction(campaign.id, 'click'); }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 bg-gray-100 hover:bg-orange-100 rounded text-orange-500 transition-all cursor-pointer"
                              title="Simulate Click"
                            >
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"></path></svg>
                            </button>
                          </p>
                          <p className="font-semibold text-gray-800 text-sm">{campaign.clicks}</p>
                        </div>
                        <div className="group relative">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide flex items-center gap-1">
                            Impressions
                            <button 
                              onClick={(e) => { e.stopPropagation(); trackInteraction(campaign.id, 'impression'); }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 bg-gray-100 hover:bg-blue-100 rounded text-blue-500 transition-all cursor-pointer"
                              title="Simulate Impression"
                            >
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"></path></svg>
                            </button>
                          </p>
                          <p className="font-semibold text-gray-800 text-sm">{campaign.impressions}</p>
                        </div>
                      </div>
                      <AdDropdown
                        onEdit={() => openEditModal(campaign)}
                        onDelete={() => openDeleteModal(campaign)}
                        onViewDetails={() => openViewModal(campaign)}
                      />
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
            <div className="mb-4 text-gray-300">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No campaigns found</h3>
            <p className="text-gray-500 mb-6 text-center max-w-xs px-4">
              {filterStatus === "All" 
                ? "You haven't created any advertisement campaigns yet." 
                : `You don't have any ${filterStatus.toLowerCase()} campaigns right now.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => fetchCampaigns()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                + Create Campaign
              </button>
            </div>
          </div>
        )}
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

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedCampaignId(null); }}
        onSave={handleUpdateCampaign}
        campaign={campaigns.find(c => c.id === selectedCampaignId)}
      />

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); setSelectedCampaignId(null); }}
        onSave={handleUpdateCampaign}
        campaign={campaigns.find(c => c.id === selectedCampaignId)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelectedCampaignId(null); }}
        onConfirm={handleDeleteCampaign}
        campaignName={campaigns.find(c => c.id === selectedCampaignId)?.title || "this campaign"}
        isLoading={isDeleting}
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