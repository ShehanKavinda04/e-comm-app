import React, { useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const CreateCampaignModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [budget, setBudget] = useState('');
    const [duration, setDuration] = useState('7');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

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
        if (!image) {
            setError('Please select an ad image');
            return;
        }

        setIsLoading(true);
        try {
            const newCampaign = {
                title,
                budget: parseFloat(budget),
                duration: parseInt(duration),
                clicks: "0",
                impressions: "0",
                status: "PAUSED",
                active: false,
                creativeUrl: image
            };

            await onSave(newCampaign);
            setTitle('');
            setBudget('');
            setDuration('7');
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to launch campaign. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Create New Campaign</h3>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Budget (Rs.)</label>
                            <input
                                type="number"
                                min="100"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                placeholder="1000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                            >
                                <option value="3">3 Days</option>
                                <option value="7">7 Days</option>
                                <option value="15">15 Days</option>
                                <option value="30">30 Days</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center min-h-[150px] overflow-hidden relative"
                            >
                                {image ? (
                                    <>
                                        <img src={image} alt="Preview" className="w-full h-32 object-contain mb-2" />
                                        <span className="text-xs text-blue-600 font-medium">Click to change image</span>
                                    </>
                                ) : (
                                    <span className="text-gray-500 text-sm">Click to upload image</span>
                                )}
                            </div>
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
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Launching...
                                </>
                            ) : 'Launch Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
