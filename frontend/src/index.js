import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@asgardeo/auth-react';
import './index.css';
import App from './App';

const authConfig = {
  signInRedirectURL: window.location.origin,
  signOutRedirectURL: window.location.origin,
  clientID: process.env.REACT_APP_CLIENT_ID || '',
  baseUrl: process.env.REACT_APP_BASE_URL || 'https://api.asgardeo.io/t/your-org',
  scope: ['openid', 'profile', 'email'],
  resourceServerURLs: [window.location.origin],
  enablePKCE: true,
  storage: 'localStorage'
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider config={authConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
