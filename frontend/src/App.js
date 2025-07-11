import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import LoginPage from './components/LoginPage';
import Header from './components/Header';

const App = () => {
  const { state, signIn, signOut, getAccessToken } = useAuthContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchBooks();
    }
  }, [state.isAuthenticated]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/api/v1/books`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${await getAccessToken()}`
        }
      });

      if (!response.ok) {
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

      const response = await fetch(`${API_BASE_URL}/api/v1/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${await getAccessToken()}`
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
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

      const response = await fetch(`${API_BASE_URL}/api/v1/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${await getAccessToken()}`
        }
      });

      if (!response.ok) {
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

  // Show loading state during authentication
  if (state.isLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!state.isAuthenticated) {
    return <LoginPage onSignIn={signIn} />;
  }

  return (
    <div className="app">
      <Header user={state.username} onSignOut={signOut} />
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

export default App;
