import React, { useEffect, useState } from "react";
import { useBookApi } from "../hooks/useApiClient";

function BookManager() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { 
    getBooks, 
    addBook: addBookApi, 
    deleteBook: deleteBookApi, 
    loading, 
    error, 
    clearError, 
    isAuthenticated 
  } = useBookApi();

  const fetchBooks = async () => {
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const addBook = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      return;
    }

    setSubmitting(true);
    clearError();
    try {
      await addBookApi({ title: title.trim(), author: author.trim() });
      setTitle("");
      setAuthor("");
      await fetchBooks();
    } catch (err) {
      console.error('Error adding book:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    clearError();
    try {
      await deleteBookApi(id);
      await fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      {error && (
        <div style={{ 
          color: "#d32f2f", 
          backgroundColor: "#ffebee",
          padding: "1rem",
          marginBottom: "1rem",
          border: "1px solid #f44336",
          borderRadius: "4px"
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={addBook} style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: "1rem", 
        marginBottom: "2rem",
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>Add New Book</h3>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={submitting}
          style={{
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: submitting ? "#f5f5f5" : "white"
          }}
        />
        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          disabled={submitting}
          style={{
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: submitting ? "#f5f5f5" : "white"
          }}
        />
        <button 
          type="submit"
          disabled={submitting || !title.trim() || !author.trim()}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: submitting ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: submitting ? "not-allowed" : "pointer",
            alignSelf: "flex-start"
          }}
        >
          {submitting ? "Adding..." : "Add Book"}
        </button>
      </form>
      
      <div style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "white",
        overflow: "hidden"
      }}>
        <h3 style={{ 
          margin: 0, 
          padding: "1rem", 
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #ddd"
        }}>
          Your Book Collection ({books.length})
        </h3>
        
        {loading ? (
          <div style={{ 
            padding: "2rem", 
            textAlign: "center",
            color: "#666"
          }}>
            <div>📚 Loading your books...</div>
          </div>
        ) : books.length === 0 ? (
          <div style={{ 
            padding: "2rem", 
            textAlign: "center",
            color: "#666"
          }}>
            <div>📖 No books in your collection yet.</div>
            <p>Add your first book using the form above!</p>
          </div>
        ) : (
          <ul style={{ 
            listStyle: "none", 
            margin: 0, 
            padding: 0 
          }}>
            {books.map((book, index) => (
              <li 
                key={book.id} 
                style={{ 
                  padding: "1rem",
                  borderBottom: index < books.length - 1 ? "1px solid #eee" : "none",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  backgroundColor: index % 2 === 0 ? "#fafafa" : "white"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: "bold", 
                    fontSize: "1.1rem",
                    marginBottom: "0.25rem"
                  }}>
                    {book.title}
                  </div>
                  <div style={{ 
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    by {book.author}
                  </div>
                </div>
                <button 
                  onClick={() => deleteBook(book.id)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "14px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginLeft: "1rem"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookManager;
