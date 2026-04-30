import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const EditCampaignModal = ({ isOpen, onClose, onSave, campaign }) => {
    const [title, setTitle] = useState('');
    const [landingUrl, setLandingUrl] = useState('');
    const [budget, setBudget] = useState('');
    const [duration, setDuration] = useState('7');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (campaign) {
            setTitle(campaign.title || '');
            setLandingUrl(campaign.landingUrl || '');
            setBudget(campaign.budget ? campaign.budget.toString() : '');
            // For duration, we calculate based on startAt and endAt if available
            setImage(campaign.creativeUrl || null);
        }
    }, [campaign]);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Campaign title is required');
            return;
        }
        if (!budget || parseFloat(budget) <= 0) {
            setError('Please enter a valid budget');
            return;
        }

        setIsLoading(true);
        try {
            const updatedData = {
                title,
                landingUrl,
                budget: parseFloat(budget),
                creativeUrl: campaign.creativeUrl, // Maintain existing image
                pricingModel: campaign.pricingModel || "CPC",
                pricePerUnit: parseFloat(campaign.pricePerUnit) || 10.0,
                startAt: campaign.startAt,
                endAt: campaign.endAt
            };

            await onSave(campaign.id, updatedData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update campaign. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Edit Campaign</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <CloseIcon />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                placeholder="e.g., Summer Sale 2024"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Landing Page URL</label>
                            <input
                                type="url"
                                value={landingUrl}
                                onChange={(e) => setLandingUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                placeholder="https://example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (Rs.)</label>
                            <input
                                type="number"
                                min="1"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                placeholder="1000"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 bg-[#E65525] hover:bg-[#d0461e] text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaignModal;
