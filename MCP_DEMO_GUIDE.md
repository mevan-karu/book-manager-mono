# Demo Guide: Vibe Deploy a 3-Tier Application in Choreo

## Overview

This demo showcases how to vibe deploy a complete 3-tier application on WSO2 Choreo platform using the Book Manager application as an example.

### Application Architecture

The Book Manager application is a modern 3-tier web application that demonstrates full-stack development and deployment on the Choreo platform. The application consists of:

- **book-manager-app (Presentation Tier)**: A React-based Single Page Application (SPA)
- **book-manager-service (Logic Tier)**: A Go-based REST API service that handles business logic and data operations
- **Database (Data Tier)**: A PostgreSQL database that stores book information and user data

This application allows users to perform create, list and delete operations on a book collection, providing a practical example of how modern web applications can be deployed and managed in a cloud-native environment.

### High-Level Demo Flow

This demonstration follows a structured approach to showcase Choreo MCP server's capabilities:

1. **Create New Project** - Create a new project called "book-manager" in Choreo to organize all components
2. **Create Service Component** - Set up the book-manager-service in Choreo using the repository's `/book-manager-service` directory
3. **Provision PostgreSQL Database** - Create a managed PostgreSQL database instance through Choreo's database services
4. **Publish the Default Database to Marketplace** - Publish the default database instance in the provisioned database server to the marketplace  
5. **Create Database Connection** - Create a connection between the book-manager-service and the PostgreSQL database
6. **Build and Re-deploy Service** - Trigger a new build and deployment of the book-manager-service with database connectivity
7. **Test Service with Test-Key** - Validate API functionality using a test-key
8. **Create Managed Auth Enabled SPA Component** - Deploy the book-manager-app as a Single Page Application with built-in authentication enabled
9. **Connect book-manager-app to book-manager-service** - Create a connection between the book-manager-app and the book-manager-service
10. **Add Sample User to IdP** - Configure a test user in Choreo's built-in Identity Provider for authentication testing
11. **Try out the Book Manager Application** - Access and test the deployed web application using the configured test user to demonstrate end-to-end functionality

### Demo Flow

Following are the steps and sample prompts to vibe-deploy a 3-tier application in Choreo:


1. Create `book-manager` project in Choreo
```
Create project book-manager in Choreo
```

2. Create Service Component for book-manager-service
```
Create a new REST service component named book-manager-service in Choreo using the `/book-manager-service` directory from the repository
```

3. Provision PostgreSQL Database
```
Create a PostgreSQL database server named book-manager-db-server in Choreo
```

4. Publish Database to Marketplace
```
Publish the default database in the book-manager-db-server to the marketplace
```

5. Create Database Connection
```
Create a connection between book-manager-service and defaultdb in book-manager-db-server database
```

6. Build and Re-deploy Service
```
Trigger build and deployment of book-manager-service
```

7. Test Service with Test-Key
```
Tryout adding a book to the book collection using the book-manager-service API using test-key.
```

8. Create Managed Auth Enabled SPA Component
```
Create a REACT SPA webapp component named book-manager-app in book-manager project using the `/book-manager-app` directory.
```

9. Connect Webapp to book-manager-service
```
Create connection from book-manager-app to the book-manager-service
```

10. Add Sample User to IdP
```
Configure test user in Choreo's Identity Provider for authentication testing
```

11. Try out the Book Manager Application
```
Access and test the deployed web application using configured test user
```
