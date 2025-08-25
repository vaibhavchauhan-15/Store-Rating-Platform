# FullStack Intern Coding Challenge

A web application that allows users to submit ratings for stores registered on the platform. The application includes different user roles (System Administrator, Normal User, Store Owner) with specific functionalities for each role.

## Tech Stack

- **Backend**: Express.js
- **Database**: PostgreSQL
- **Frontend**: React.js

## Features

### User Roles
1. **System Administrator**
   - Add new stores, normal users, and admin users
   - Dashboard with statistics
   - Manage users and stores
   - Filter and view listings
   
2. **Normal User**
   - Sign up and log in
   - Update password
   - View and search stores
   - Submit and modify ratings
   
3. **Store Owner**
   - Log in and update password
   - View users who submitted ratings
   - See average store rating

### Form Validations
- Name: Min 20 characters, Max 60 characters
- Address: Max 400 characters
- Password: 8-16 characters, with at least one uppercase letter and one special character
- Email: Standard email validation

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install server dependencies
```
npm run install-server
```

3. Install client dependencies
```
npm run install-client
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
PG_URI=postgresql://username:password@localhost:5432/dbname
```

5. Start the development server
```
npm run dev
```

## Database Schema

The application uses three main tables:
1. **Users** - Stores user information and roles
2. **Stores** - Contains store details
3. **Ratings** - Tracks ratings submitted by users for stores

## API Documentation

The API documentation is available at `/api-docs` when the server is running.
