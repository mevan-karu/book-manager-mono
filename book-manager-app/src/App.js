import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import apiClient from './services/apiClient';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import Header from './components/Header';

// Login Page Component
const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>📚 Book Manager</h2>
        <p>Please log in to manage your books.</p>
        <button 
          className="login-btn"
          onClick={() => {
            window.location.href = "/auth/login";
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return children;
};

// Dashboard Component (Main Book Management)
const Dashboard = ({ onSignOut, books, loading, error, success, addBook, deleteBook }) => {
  return (
    <div className="app">
      <Header user="User" onSignOut={onSignOut} />
      <main className="main-content">
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        {success && (
          <div className="success">
            {success}
          </div>
        )}
        
        <BookForm onSubmit={addBook} loading={loading} />
        <BookList 
          books={books} 
          onDelete={deleteBook}
          loading={loading}
        />
      </main>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await apiClient.checkAuth();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    // Use the proper logout method with session handling
    apiClient.redirectToLogout();
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await apiClient.getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === 'Authentication required') {
        setIsAuthenticated(false);
        setBooks([]); // Ensure books is always an array
        return;
      }
      setBooks([]); // Ensure books is always an array on error
      setError('Failed to load books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const newBook = await apiClient.createBook(bookData);
      setBooks(prevBooks => [...(Array.isArray(prevBooks) ? prevBooks : []), newBook]);
      setSuccess('Book added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.message === 'Authentication required') {
        setIsAuthenticated(false);
        return;
      }
      setError('Failed to add book. Please try again.');
      console.error('Error adding book:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await apiClient.deleteBook(bookId);
      setBooks(prevBooks => (Array.isArray(prevBooks) ? prevBooks : []).filter(book => book.id !== bookId));
      setSuccess('Book deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.message === 'Authentication required') {
        setIsAuthenticated(false);
        return;
      }
      setError('Failed to delete book. Please try again.');
      console.error('Error deleting book:', err);
    } finally {
      setLoading(false);
    }
  };

  // If loading, show loading screen
  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Root path redirects to dashboard */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
        
        {/* Protected dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <Dashboard 
                onSignOut={handleSignOut}
                books={books}
                loading={loading}
                error={error}
                success={success}
                addBook={addBook}
                deleteBook={deleteBook}
              />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
