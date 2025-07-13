import React from 'react';

const Header = ({ user, onSignOut }) => {
  return (
    <header className="header">
      <h1>📚 Book Manager</h1>
      <div className="user-info">
        <span>Welcome, {user || 'User'}!</span>
        <button 
          className="logout-btn"
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
