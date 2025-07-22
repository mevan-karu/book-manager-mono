import { useState, useCallback } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useApiClient = () => {
  const { httpRequest, state } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    if (!state.isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await httpRequest({
        url: `${API_BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        data: options.body ? JSON.stringify(options.body) : undefined
      });

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Request failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [httpRequest, state.isAuthenticated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    makeRequest,
    loading,
    error,
    clearError,
    isAuthenticated: state.isAuthenticated
  };
};

export const useBookApi = () => {
  const apiClient = useApiClient();

  const getBooks = useCallback(async () => {
    const response = await apiClient.makeRequest('/api/v1/books');
    return response.data || [];
  }, [apiClient]);

  const addBook = useCallback(async (bookData) => {
    const response = await apiClient.makeRequest('/api/v1/books', {
      method: 'POST',
      body: bookData
    });
    return response.data;
  }, [apiClient]);

  const deleteBook = useCallback(async (bookId) => {
    await apiClient.makeRequest(`/api/v1/books/${bookId}`, {
      method: 'DELETE'
    });
  }, [apiClient]);

  return {
    getBooks,
    addBook,
    deleteBook,
    loading: apiClient.loading,
    error: apiClient.error,
    clearError: apiClient.clearError,
    isAuthenticated: apiClient.isAuthenticated
  };
};
