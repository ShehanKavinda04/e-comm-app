import React from 'react';

const AdCampaignStats = ({ data }) => {
    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const impressions = data?.totalImpressions || 0;
    const clicks = data?.totalClicks || 0;
    const ctr = data?.avgCtr || 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-700 font-medium text-sm mb-6">Ad Campaign Performance</h3>
            <div className="flex justify-around items-center">
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Impressions</p>
                    <h4 className="text-lg font-bold text-gray-800">{formatNumber(impressions)}</h4>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Clicks</p>
                    <h4 className="text-lg font-bold text-gray-800">{formatNumber(clicks)}</h4>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">CTR</p>
                    <h4 className="text-lg font-bold text-gray-800">{ctr}%</h4>
                </div>
            </div>
        </div>
    );
};

export default AdCampaignStats;
