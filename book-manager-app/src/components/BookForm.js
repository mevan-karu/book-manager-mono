import React, { useState } from 'react';

const BookForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.author.trim()) {
      onSubmit(formData);
      setFormData({ title: '', author: '', isbn: '' });
    }
  };

  const handleReset = () => {
    setFormData({ title: '', author: '', isbn: '' });
  };

  return (
    <div className="book-form">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter book title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter author name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter ISBN (optional)"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !formData.title.trim() || !formData.author.trim()}
          >
            {loading ? 'Adding...' : 'Add Book'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
