import Cookies from 'js-cookie';

// API Client Configuration
const API_CONFIG = {
  authPath: '/auth/signin', // Separate auth app path
};

class ApiClient {
  constructor() {
    this.authPath = API_CONFIG.authPath;
  }

  // Get base path dynamically to ensure window.configs is available
  getBasePath() {
    return window?.configs?.apiUrl || "/";
  }

  // Configure base path dynamically
  setBasePath(basePath) {
    this.basePath = basePath;
  }

  // Generic fetch wrapper with authentication handling
  async request(endpoint, options = {}) {
    const basePath = this.basePath || this.getBasePath();
    const url = `${basePath}${endpoint}`;
    
    const defaultOptions = {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      // Handle authentication errors
      if (response.status === 401) {
        this.redirectToLogin();
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Redirect to authentication app
  redirectToLogin() {
    window.location.href = '/auth/login';
  }

  // Logout with session handling according to Choreo docs
  redirectToLogout() {
    const sessionHint = Cookies.get('session_hint');
    window.location.href = `/auth/logout${sessionHint ? `?session_hint=${sessionHint}` : ''}`;
  }

  // Health check endpoint
  async healthCheck() {
    return this.request('/health');
  }

  // Book API methods
  async getBooks() {
    return this.request('/api/v1/books');
  }

  async createBook(bookData) {
    return this.request('/api/v1/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(bookId) {
    return this.request(`/api/v1/books/${bookId}`, {
      method: 'DELETE',
    });
  }

  // Check if user is authenticated using Choreo's managed auth endpoint
  async checkAuth() {
    try {
      // Use Choreo's managed auth userinfo endpoint to check authentication status
      const response = await fetch('/auth/userinfo', {
        credentials: 'include', // Include cookies for authentication
      });
      
      if (response.ok) {
        // User is authenticated, optionally get user info
        const userInfo = await response.json();
        console.log('User authenticated:', userInfo);
        return true;
      } else if (response.status === 401) {
        // User is not authenticated
        return false;
      } else {
        // Other error occurred
        console.error('Auth check failed with status:', response.status);
        return false;
      }
    } catch (error) {
      // Network error or other issue
      console.log('Authentication check failed:', error.message);
      return false;
    }
  }

  // Get user information from userinfo cookie (if available) or endpoint
  async getUserInfo() {
    try {
      // First try to get from userinfo cookie
      const encodedUserInfo = Cookies.get('userinfo');
      if (encodedUserInfo) {
        const userInfo = JSON.parse(atob(encodedUserInfo));
        // Clear the cookie as recommended by Choreo docs
        Cookies.remove('userinfo', { path: '/' });
        return userInfo;
      }

      // If cookie not available, use the endpoint
      const response = await fetch('/auth/userinfo', {
        credentials: 'include',
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient; 
