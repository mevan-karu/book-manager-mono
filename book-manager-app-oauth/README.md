# Book Manager OAuth App

A modern React application that uses the **Asgardeo React SDK** to manage books with secure OAuth authentication through Choreo. This app demonstrates best practices for implementing authentication, making secure API calls, and handling errors gracefully.

## ✨ Features

- 🔐 **Secure Authentication**: OAuth 2.0 with PKCE using Asgardeo/Choreo
- 📚 **Book Management**: Add, view, and delete books from your collection
- 🛡️ **Authenticated API Calls**: All API requests include proper authorization headers
- 🎨 **Modern UI**: Clean, responsive design with loading states and error handling
- ⚡ **Performance**: Optimized with React hooks and efficient state management
- 🔄 **Error Recovery**: Comprehensive error handling with user-friendly messages
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or later)
- A Choreo account and configured OAuth application
- Access to a backend API for book management

### Installation

1. **Clone and navigate to the directory:**
   ```bash
   cd book-manager-app-oauth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual values:
   ```env
   REACT_APP_CLIENT_ID=your_choreo_client_id_here
   REACT_APP_BASE_URL=https://api.asgardeo.io/t/your_organization_name
   REACT_APP_API_BASE_URL=https://your-backend-api-url.com
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open your browser:** Navigate to `http://localhost:3000`

## 🔧 Configuration

### Choreo/Asgardeo Setup

1. **Create an OAuth Application** in your Choreo console
2. **Configure redirect URLs:**
   - Authorized Redirect URLs: `http://localhost:3000` (for development)
   - Authorized JavaScript Origins: `http://localhost:3000`
3. **Set up scopes:** Ensure your application has access to `openid`, `profile`, and `email` scopes
4. **Configure resource servers:** Add your backend API URL to authorized resource servers

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_CLIENT_ID` | OAuth client ID from Choreo | `a1b2c3d4e5f6g7h8i9j0` |
| `REACT_APP_BASE_URL` | Asgardeo organization base URL | `https://api.asgardeo.io/t/myorg` |
| `REACT_APP_API_BASE_URL` | Backend API base URL | `https://api.myapp.com` |

## 🏗️ Architecture

### Key Components

- **App.js**: Main application component with authentication provider
- **BookManager.js**: Core book management functionality
- **ErrorBoundary.js**: Global error handling component
- **useApiClient.js**: Custom hook for authenticated API calls
- **utils/**: Utility functions for validation and error handling

### Authentication Flow

1. User clicks "Sign In with Choreo"
2. Redirects to Asgardeo for authentication
3. Returns to app with authorization code
4. SDK exchanges code for access token
5. Token is used for all subsequent API calls

### API Integration

The app uses the `httpRequest` method from the Asgardeo SDK to make authenticated API calls:

```javascript
const response = await httpRequest({
  url: 'https://api.example.com/books',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## 🔐 Security Features

- **PKCE (Proof Key for Code Exchange)**: Enhanced OAuth security
- **Web Worker Storage**: Secure token storage using web workers
- **Automatic Token Refresh**: SDK handles token renewal automatically
- **Request Interceptors**: Automatic authorization header injection
- **Error Handling**: Secure error messages without exposing sensitive data

## 🧪 Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (irreversible)

### Code Structure

```
src/
├── components/          # React components
│   ├── BookManager.js   # Main book management component
│   └── ErrorBoundary.js # Error boundary component
├── hooks/              # Custom React hooks
│   └── useApiClient.js # API client hook
├── utils/              # Utility functions
│   └── index.js        # Common utilities
├── App.js              # Main app component
└── index.js            # App entry point
```

## 📦 Deployment

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Environment-Specific Configuration

For production deployment, ensure:

1. **Update redirect URLs** in Choreo console to match your production domain
2. **Set production environment variables**
3. **Configure CORS** on your backend API
4. **Enable HTTPS** for secure OAuth flows

### Deployment Platforms

The app can be deployed to various platforms:

- **Netlify**: Drag & drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3 + CloudFront**: Upload build files to S3
- **Firebase Hosting**: Use Firebase CLI

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify client ID and base URL in `.env`
   - Check redirect URLs in Choreo console
   - Ensure CORS is configured on your identity provider

2. **API Call Failures**
   - Verify backend API URL is correct and accessible
   - Check if API requires specific scopes
   - Ensure backend accepts the authorization header format

3. **Token Expiry**
   - SDK automatically handles token refresh
   - If issues persist, check token lifetime configuration

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
REACT_APP_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🔗 Related Resources

- [Asgardeo React SDK Documentation](https://github.com/asgardeo/asgardeo-auth-react-sdk)
- [Choreo Documentation](https://wso2.com/choreo/docs/)
- [OAuth 2.0 with PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [React Documentation](https://reactjs.org/docs/)

## 📞 Support

For issues and questions:
- Check the [Issues](https://github.com/your-repo/issues) section
- Consult [Asgardeo Community](https://github.com/asgardeo/asgardeo-auth-react-sdk/discussions)
- Review [Choreo Documentation](https://wso2.com/choreo/docs/)

---

Built with ❤️ using React and Asgardeo
