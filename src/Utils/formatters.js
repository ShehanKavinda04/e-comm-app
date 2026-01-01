
/**
 * Formats a number as a currency string.
 * @param {number} amount - The amount to format.
 * @param {string} currency - The currency symbol (default: 'Rs.').
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount, currency = 'Rs.') => {
    if (amount === undefined || amount === null) return `${currency} 0.00`;
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
