/**
 * Utility functions for the Book Manager OAuth app
 */

/**
 * Formats error messages for user display
 * @param {Error|string} error - The error to format
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Validates book form data
 * @param {Object} bookData - The book data to validate
 * @param {string} bookData.title - The book title
 * @param {string} bookData.author - The book author
 * @returns {Object} Validation result with isValid and errors
 */
export const validateBookData = ({ title, author }) => {
  const errors = {};
  
  if (!title || !title.trim()) {
    errors.title = 'Title is required';
  } else if (title.trim().length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }
  
  if (!author || !author.trim()) {
    errors.author = 'Author is required';
  } else if (author.trim().length > 100) {
    errors.author = 'Author name must be less than 100 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Creates a retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Function} Function that retries on failure
 */
export const withRetry = (fn, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries) {
          // Wait with exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  };
};
