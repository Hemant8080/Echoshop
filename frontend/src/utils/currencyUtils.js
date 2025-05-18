// Currency utilities

/**
 * Format price in INR with ₹ symbol
 * @param {number} amount - Amount to format (already in INR)
 * @returns {string} Formatted price with ₹ symbol
 */
export const formatINR = (amount) => {
  if (!amount || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toFixed(2)}`;
};

// For backward compatibility, but we won't use it anymore
export const convertUSDtoINR = (usdAmount) => {
  // No longer converting, just returning the same amount
  return usdAmount;
};

// For backward compatibility, but we won't display this anymore
export const formatUSD = (amount) => {
  if (!amount || isNaN(amount)) return '$0';
  return `$${Number(amount).toFixed(2)}`;
};
