import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ViewDetailsModal = ({ isOpen, onClose, campaign, onSave }) => {
    const [isEditingSchedule, setIsEditingSchedule] = useState(false);
    const [editedStartAt, setEditedStartAt] = useState('');
    const [editedEndAt, setEditedEndAt] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !campaign) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const remainingBudget = (campaign.budget || 0) - (campaign.spent || 0);

    const handleEditClick = () => {
        setEditedStartAt(campaign.startAt ? campaign.startAt.substring(0, 16) : '');
        setEditedEndAt(campaign.endAt ? campaign.endAt.substring(0, 16) : '');
        setIsEditingSchedule(true);
    };

    const handleSaveSchedule = async () => {
        setIsSaving(true);
        try {
            await onSave(campaign.id, {
                ...campaign,
                startAt: editedStartAt,
                endAt: editedEndAt
            });
            setIsEditingSchedule(false);
        } catch (error) {
            console.error("Failed to save schedule:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{campaign.title}</h3>
                        <p className="text-sm text-gray-500">Campaign ID: #{campaign.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full">
                        <CloseIcon />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Metrics & Budget */}
                    <div className="space-y-6">
                        <section>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                                <BarChartIcon className="w-4 h-4 text-orange-500" />
                                Performance Metrics
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <MetricBox label="Impressions" value={campaign.impressions || 0} />
                                <MetricBox label="Clicks" value={campaign.clicks || 0} />
                                <MetricBox label="CTR" value={`${campaign.ctr || 0}%`} />
                                <MetricBox label="Conversions" value={campaign.conversions || 0} />
                            </div>
                        </section>

                        <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                <AccountBalanceWalletIcon className="w-4 h-4 text-orange-500" />
                                Budget Analytics
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Budget</span>
                                    <span className="font-bold text-gray-800">Rs. {campaign.budget?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Spent to Date</span>
                                    <span className="font-bold text-orange-600">Rs. {campaign.spent?.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-sm">
                                    <span className="text-gray-700 font-medium">Remaining Funds</span>
                                    <span className="font-bold text-green-600">Rs. {remainingBudget.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                                    <div 
                                        className="bg-orange-500 h-1.5 rounded-full" 
                                        style={{ width: `${Math.min(((campaign.spent || 0) / (campaign.budget || 1)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Creative & Schedule */}
                    <div className="space-y-6">
                        <section>
                            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Campaign Creative</h4>
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
                                <img 
                                    src={campaign.image} 
                                    alt={campaign.title} 
                                    className="w-full aspect-video object-cover transition-transform group-hover:scale-105 duration-500"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${campaign.active ? 'bg-green-500' : 'bg-orange-500'}`}>
                                        {campaign.status}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    <CalendarTodayIcon className="w-4 h-4 text-orange-500" />
                                    Scheduling
                                </h4>
                                {!isEditingSchedule ? (
                                    <button 
                                        onClick={handleEditClick}
                                        className="text-gray-400 hover:text-orange-500 transition group flex items-center gap-1"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleSaveSchedule}
                                            disabled={isSaving}
                                            className="text-green-500 hover:text-green-600 flex items-center gap-1 disabled:opacity-50"
                                            title="Save Changes"
                                        >
                                            <SaveIcon className="w-4 h-4" />
                                            {isSaving && <span className="text-[10px] animate-pulse">...</span>}
                                        </button>
                                        <button 
                                            onClick={() => setIsEditingSchedule(false)}
                                            className="text-red-400 hover:text-red-500"
                                            title="Cancel"
                                        >
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Start Date</p>
                                    {!isEditingSchedule ? (
                                        <p className="text-sm font-medium text-gray-800">{formatDate(campaign.startAt)}</p>
                                    ) : (
                                        <input 
                                            type="datetime-local"
                                            value={editedStartAt}
                                            onChange={(e) => setEditedStartAt(e.target.value)}
                                            className="w-full text-sm bg-white border border-gray-200 rounded p-1.5 focus:border-orange-500 outline-none"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">End Date</p>
                                    {!isEditingSchedule ? (
                                        <p className="text-sm font-medium text-gray-800">{formatDate(campaign.endAt)}</p>
                                    ) : (
                                        <input 
                                            type="datetime-local"
                                            value={editedEndAt}
                                            onChange={(e) => setEditedEndAt(e.target.value)}
                                            className="w-full text-sm bg-white border border-gray-200 rounded p-1.5 focus:border-orange-500 outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetricBox = ({ label, value }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-orange-200 transition-colors">
        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
);

export default ViewDetailsModal;
