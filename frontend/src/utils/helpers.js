// Get color based on value type (income/expense)
export const getAmountColor = (type) => {
  return type === 'income' ? '#10b981' : '#f59e0b';
};

// Calculate days between two dates
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Get month name
export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber];
};

// Get current month and year
export const getCurrentPeriod = () => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
    monthName: getMonthName(now.getMonth()),
  };
};

// Check if date is in current month
export const isCurrentMonth = (date) => {
  const current = new Date();
  const targetDate = new Date(date);
  return (
    current.getMonth() === targetDate.getMonth() &&
    current.getFullYear() === targetDate.getFullYear()
  );
};

// Get date range for filter
export const getDateRange = (range) => {
  const now = new Date();
  let from, to;

  switch (range) {
    case 'today':
      from = to = now.toISOString().split('T')[0];
      break;
    case 'week':
      from = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      to = new Date().toISOString().split('T')[0];
      break;
    case 'month':
      from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      break;
    case 'year':
      from = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      to = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
      break;
    default:
      from = to = null;
  }

  return { from, to };
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random color
export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Sort array by key
export const sortByKey = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

export default {
  getAmountColor,
  daysBetween,
  getMonthName,
  getCurrentPeriod,
  isCurrentMonth,
  getDateRange,
  debounce,
  truncateText,
  generateRandomColor,
  sortByKey,
  isEmpty,
  deepClone,
  storage,
};
