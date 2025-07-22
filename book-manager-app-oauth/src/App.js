import React from "react";
import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import BookManager from "./components/BookManager";
import ErrorBoundary from "./components/ErrorBoundary";

const config = {
  clientID: window.configs.clientID,
  baseUrl: window.configs.idpBaseUrl,
  signInRedirectURL: window.location.origin,
  signOutRedirectURL: window.location.origin,
  scope: ["openid", "profile", "email"],
  resourceServerURLs: [window.configs.bookServiceBaseUrl],
  enablePKCE: true,
  storage: "webWorker", // Use web worker for better security
};

function AuthenticatedApp() {
  const { state, signIn, signOut } = useAuthContext();

  // Show loading state while authentication is being initialized
  if (state.isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column" 
      }}>
        <div>Loading...</div>
        <p>Initializing authentication...</p>
      </div>
    );
  }

  // Show sign-in screen if not authenticated
  if (!state.isAuthenticated) {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: "50px",
        padding: "2rem"
      }}>
        <h2>📚 Book Manager</h2>
        <p>Please sign in to access your book collection</p>
        <button 
          onClick={() => signIn()}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "1rem"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Sign In with Choreo
        </button>
        {state.error && (
          <div style={{ 
            color: "red", 
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#ffebee"
          }}>
            Authentication Error: {state.error}
          </div>
        )}
      </div>
    );
  }

  // Show the main app with user profile
  return (
    <div>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1rem",
        borderBottom: "1px solid #eee",
        backgroundColor: "#f8f9fa"
      }}>
        <div>
          <h2 style={{ margin: 0 }}>📚 Book Manager</h2>
          {state.username && (
            <p style={{ 
              margin: "0.25rem 0 0 0", 
              fontSize: "0.9rem", 
              color: "#666" 
            }}>
              Welcome, {state.displayName || state.username}!
            </p>
          )}
        </div>
        <button 
          onClick={() => signOut()}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
        >
          Sign Out
        </button>
      </header>
      <main>
        <BookManager />
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider config={config}>
        <AuthenticatedApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
