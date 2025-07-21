import Cookies from 'js-cookie';

// API Client Configuration
const API_CONFIG = {
  // Change this base path as needed for your environment
  basePath: window?.configs?.apiUrl ? window.configs.apiUrl : "/",
  authPath: '/auth/signin', // Separate auth app path
};

class ApiClient {
  constructor() {
    this.basePath = API_CONFIG.basePath;
    this.authPath = API_CONFIG.authPath;
  }

  // Configure base path dynamically
  setBasePath(basePath) {
    this.basePath = basePath;
  }

  // Generic fetch wrapper with authentication handling
  async request(endpoint, options = {}) {
    const url = `${this.basePath}${endpoint}`;
    
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

  // Logout with session handling
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
    return this.request('/api/v1/books/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(bookId) {
    return this.request(`/api/v1/books/${bookId}`, {
      method: 'DELETE',
    });
  }

  // Check if user is authenticated by trying to access a protected endpoint
  async checkAuth() {
    try {
      // Try to access the books endpoint instead of health check
      // This is more reliable for checking authentication status
      await this.request('/api/v1/books');
      return true;
    } catch (error) {
      // If we get an authentication error or any error, consider user not authenticated
      console.log('Authentication check failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient; 
