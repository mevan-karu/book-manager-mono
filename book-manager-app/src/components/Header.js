import React from 'react';

const Header = ({ user, onSignOut }) => {
  // Extract display name from user object if available
  const displayName = user?.name || user?.given_name || user?.email || 'User';
  
  return (
    <header className="header">
      <h1>📚 Book Manager</h1>
      <div className="user-info">
        <span>Welcome, {displayName}!</span>
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
