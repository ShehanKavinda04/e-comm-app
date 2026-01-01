// src/components/orders/utils.js
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getStatusBadge = (status) => {
  const styles = {
    processing: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    shipped: 'bg-blue-100 text-blue-800 border-blue-400',
    delivered: 'bg-green-100 text-green-800 border-green-400',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
        styles[status] || 'bg-gray-100 text-gray-800 border-gray-400'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const getTrackingUrl = (trackingNumber, provider) => {
  if (!trackingNumber || !provider) return null;

  const providers = {
    delhivery: `https://www.delhivery.com/track/${trackingNumber}`,
    'blue-dart': `https://www.bluedart.com/tracking?track=${trackingNumber}`,
    dtc: `https://www.dtdc.in/track/${trackingNumber}`,
    ecom: `https://www.ecomexpress.in/tracking/${trackingNumber}`,
  };

  return providers[provider] || `https://www.google.com/search?q=track+${trackingNumber}`;
};

export const generateStatusSummary = (order, currentDate = new Date('2025-12-12')) => {
  const expected = order.expectedDelivery ? new Date(order.expectedDelivery) : null;

  if (order.status === 'delivered') {
    return `Your order was successfully delivered on ${formatDate(order.expectedDelivery || order.date)}. Enjoy your purchase!`;
  }

  if (order.status === 'processing') {
    return `Your order is still being processed. Once shipped, you'll receive a tracking number and estimated delivery date.`;
  }

  if (order.status === 'shipped' && expected) {
    const daysLeft = Math.ceil((expected - currentDate) / (1000 * 60 * 60 * 24));
    if (daysLeft > 0) {
      return `Your order is on its way! It's expected to arrive by ${formatDate(order.expectedDelivery)} (${daysLeft} day${daysLeft > 1 ? 's' : ''} from today).`;
    } else if (daysLeft === 0) {
      return `Your order is out for delivery today! Keep an eye on the tracking link.`;
    } else {
      return `Your order is in transit and was expected on ${formatDate(order.expectedDelivery)}. It may be delayed — please check the tracking link for the latest update.`;
    }
  }

  return 'No detailed status available at the moment.';
};