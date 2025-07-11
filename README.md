# Book Manager Application

A simple book management web application built with React frontend and Go backend, designed to be deployed on Choreo.

## Features

- **Authentication**: Secure authentication using Choreo Managed Authentication
- **Book Management**: Add, list, and delete books
- **Database**: PostgreSQL database for data persistence
- **Modern UI**: Responsive React-based user interface

## Project Structure

```
book-manager-mono/
├── backend/           # Go backend service
│   ├── .choreo/      # Choreo component configuration
│   ├── main.go       # Main application file
│   ├── go.mod        # Go module file
│   └── openapi.yaml  # API specification
├── frontend/         # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Public assets
│   ├── package.json  # npm dependencies
│   └── .env          # Environment variables
└── README.md
```

## Prerequisites

- Go 1.21 or later
- Node.js 18 or later
- PostgreSQL database
- Choreo account

## Local Development

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Set up environment variables:
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_USER=postgres
   export DB_PASSWORD=your_password
   export DB_NAME=bookmanager
   export DB_SSLMODE=disable
   export PORT=8080
   ```

4. Run the backend:
   ```bash
   go run main.go
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your Choreo authentication configuration:
   ```
   REACT_APP_CLIENT_ID=your_choreo_client_id
   REACT_APP_BASE_URL=https://api.asgardeo.io/t/your_org_name
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```

4. Run the frontend:
   ```bash
   npm start
   ```

## Choreo Deployment

### Prerequisites

1. Create a Choreo project
2. Set up a PostgreSQL database connection in Choreo
3. Configure Choreo Managed Authentication

### Backend Component

The backend is configured as a Choreo service component with:
- Go buildpack
- PostgreSQL database connection
- REST API endpoints for book management

### Frontend Component

The frontend is configured as a Choreo web application with:
- React buildpack
- Choreo Managed Authentication integration
- Environment-based configuration

### Database Setup

1. Create a PostgreSQL database server in Choreo
2. Publish the default database to the marketplace
3. Create a database connection from the backend component
4. Add the connection reference to the backend's `component.yaml`

### Authentication Setup

1. Enable Choreo Managed Authentication for the frontend component
2. Configure the OAuth client settings
3. Update frontend environment variables with the client ID and base URL

## API Endpoints

### Health Check
- `GET /health` - Service health check

### Books API
- `GET /api/v1/books` - Get all books
- `POST /api/v1/books` - Create a new book
- `DELETE /api/v1/books/{id}` - Delete a book by ID

## Authentication Flow

1. User visits the application
2. If not authenticated, user is redirected to login page
3. User clicks "Sign In with Choreo"
4. Choreo handles OAuth flow
5. User is redirected back to the application with authentication
6. User can now manage books

## Environment Variables

### Backend
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_SSLMODE` - SSL mode for database connection
- `PORT` - Server port (default: 8080)

### Frontend
- `REACT_APP_CLIENT_ID` - Choreo OAuth client ID
- `REACT_APP_BASE_URL` - Choreo organization base URL
- `REACT_APP_API_BASE_URL` - Backend API base URL

## Technologies Used

- **Backend**: Go, Gin framework, PostgreSQL
- **Frontend**: React, Asgardeo Auth React SDK
- **Authentication**: Choreo Managed Authentication
- **Database**: PostgreSQL
- **Deployment**: Choreo Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
