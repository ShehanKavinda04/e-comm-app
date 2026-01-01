import React from 'react';

const AdCampaignStats = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-700 font-medium text-sm mb-6">Ad Campaign Performance</h3>
            <div className="flex justify-around items-center">
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Impressions</p>
                    <h4 className="text-lg font-bold text-gray-800">150K</h4>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Clicks</p>
                    <h4 className="text-lg font-bold text-gray-800">7.5K</h4>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">CTR</p>
                    <h4 className="text-lg font-bold text-gray-800">5%</h4>
                </div>
            </div>
        </div>
    );
};

export default AdCampaignStats;
