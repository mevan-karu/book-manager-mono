import React from 'react';

const LoginPage = ({ onSignIn }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Book Manager</h2>
        <p>
          Manage your book collection with ease. Sign in with your Choreo account to get started.
        </p>
        <button 
          className="login-btn"
          onClick={onSignIn}
        >
          Sign In with Choreo
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
