import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import LoginPage from './components/LoginPage';
import Header from './components/Header';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Login Route Component
const LoginRoute = ({ isAuthenticated, isLoading, onSignIn }) => {
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirect to intended path or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }
  
  return <LoginPage onSignIn={onSignIn} />;
};

// Dashboard Component (Main Book Management)
const Dashboard = ({ user, onSignOut, books, loading, error, success, addBook, deleteBook }) => {
  return (
    <div className="app">
      <Header user={user?.username || user?.name || 'User'} onSignOut={onSignOut} />
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
  const [user, setUser] = useState(null);
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
      // Check if user is authenticated by calling the userinfo endpoint
      const response = await fetch('/auth/userinfo');
      
      if (response.ok) {
        const userInfo = await response.json();
        setUser(userInfo);
        setIsAuthenticated(true);
        
        // Also check for userinfo cookie and clear it if present
        const encodedUserInfo = Cookies.get('userinfo');
        if (encodedUserInfo) {
          const cookieUserInfo = JSON.parse(atob(encodedUserInfo));
          setUser(cookieUserInfo);
          // Clear the cookie
          Cookies.remove('userinfo', { path: '/' });
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    window.location.href = '/auth/login';
  };

  const handleSignOut = () => {
    const sessionHint = Cookies.get('session_hint');
    window.location.href = `/auth/logout${sessionHint ? `?session_hint=${sessionHint}` : ''}`;
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use relative path for Choreo API with session-based auth
      const response = await fetch('/choreo-apis/book-manager-backend/api/v1/books', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired, redirect to login
          window.location.href = '/auth/login';
          return;
        }
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data || []);
    } catch (err) {
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

      const response = await fetch('/choreo-apis/book-manager-backend/api/v1/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired, redirect to login
          window.location.href = '/auth/login';
          return;
        }
        throw new Error('Failed to add book');
      }

      const newBook = await response.json();
      setBooks([...books, newBook]);
      setSuccess('Book added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
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

      const response = await fetch(`/choreo-apis/book-manager-backend/api/v1/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired, redirect to login
          window.location.href = '/auth/login';
          return;
        }
        throw new Error('Failed to delete book');
      }

      setBooks(books.filter(book => book.id !== bookId));
      setSuccess('Book deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete book. Please try again.');
      console.error('Error deleting book:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Root path redirects based on auth status */}
        <Route 
          path="/" 
          element={
            isLoading ? (
              <div className="loading">
                <p>Loading...</p>
              </div>
            ) : isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Login route */}
        <Route 
          path="/login" 
          element={
            <LoginRoute 
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              onSignIn={handleSignIn}
            />
          } 
        />
        
        {/* Protected dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <Dashboard 
                user={user}
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
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
