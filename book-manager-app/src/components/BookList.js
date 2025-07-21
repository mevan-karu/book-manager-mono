import React from 'react';

const BookList = ({ books = [], onDelete, loading }) => {
  // Ensure books is always an array
  const booksList = Array.isArray(books) ? books : [];
  
  if (loading && booksList.length === 0) {
    return (
      <div className="books-list">
        <h2>My Book Collection</h2>
        <div className="loading">
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  if (booksList.length === 0) {
    return (
      <div className="books-list">
        <h2>My Book Collection</h2>
        <div className="empty-state">
          <p>No books in your collection yet.</p>
          <p>Add your first book using the form above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="books-list">
      <h2>My Book Collection ({booksList.length} books)</h2>
      <div className="books-grid">
        {booksList.map((book) => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            {book.isbn && (
              <div className="isbn">
                <strong>ISBN:</strong> {book.isbn}
              </div>
            )}
            <button
              className="delete-btn"
              onClick={() => onDelete(book.id)}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
