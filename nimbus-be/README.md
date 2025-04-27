# Nimbus Backend

A RESTful API backend for the Nimbus platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication with JWT
- Role-based authorization
- Password hashing with bcrypt
- RESTful API endpoints for user management
- TypeScript for type safety
- Swagger API documentation

## Project Structure

```
src/
  ├── config/         # Configuration files
  ├── controllers/    # Request handlers
  ├── middlewares/    # Custom middlewares
  ├── models/         # Mongoose models
  ├── routes/         # API routes
  ├── utils/          # Utility functions
  └── index.ts        # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud instance)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nimbus
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm start
   ```

## API Documentation

The API is documented using Swagger. When the server is running, you can access the Swagger UI at:

```
http://localhost:5000/api-docs
```

This provides an interactive documentation where you can:

- View all available endpoints
- Read detailed information about request/response formats
- Test the API directly from the browser

## API Routes

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token
- GET `/api/auth/me` - Get current user profile
- PUT `/api/auth/update-profile` - Update user profile
- PUT `/api/auth/change-password` - Change user password
