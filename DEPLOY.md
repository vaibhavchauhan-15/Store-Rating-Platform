# Store Rating Platform - Deployment Guide

## Deploying to Render

This guide walks through the steps to deploy this application to Render.

### Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Git repository with your code (GitHub, GitLab, etc.)

### Deployment Steps

#### Option 1: Using render.yaml (Blueprint)

1. Fork or clone this repository to your GitHub account
2. In your Render dashboard, click on "New" and select "Blueprint"
3. Connect your GitHub account and select this repository
4. Render will automatically detect the `render.yaml` file and set up your services
5. Click "Apply" to start the deployment
6. Once deployment is complete, Render will provide you with a URL for your application

#### Option 2: Manual Setup

1. **Create a PostgreSQL Database**:
   - From your Render dashboard, click "New" and select "PostgreSQL"
   - Name it "store-rating-db"
   - Choose a region and plan (Free tier is available)
   - Click "Create Database"
   - Note down the connection details (Internal Database URL, Host, etc.)

2. **Deploy the Web Service**:
   - From your Render dashboard, click "New" and select "Web Service"
   - Connect to your repository
   - Fill in the details:
     - Name: store-rating-platform-backend
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
   - In the "Environment Variables" section, add the following:
     - `NODE_ENV`: production
     - `PORT`: 10000
     - `DB_NAME`: (from your Render PostgreSQL details)
     - `DB_USER`: (from your Render PostgreSQL details)
     - `DB_PASSWORD`: (from your Render PostgreSQL details)
     - `DB_HOST`: (from your Render PostgreSQL details)
     - `DB_PORT`: (from your Render PostgreSQL details, usually 5432)
     - `JWT_SECRET`: (generate a secure random string)
   - Click "Create Web Service"

3. **Configure CORS (if needed)**:
   - If you're deploying the frontend separately, update your CORS settings in the backend code

### Environment Variables

Your application requires the following environment variables:

- `NODE_ENV`: Set to 'production' for deployment
- `PORT`: The port your server will run on (default: 10000 on Render)
- `DB_NAME`: PostgreSQL database name
- `DB_USER`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: PostgreSQL host address
- `DB_PORT`: PostgreSQL port (typically 5432)
- `JWT_SECRET`: Secret key for JWT token generation/validation

### Monitoring and Logs

After deployment:
1. Go to your Web Service in the Render dashboard
2. Click on "Logs" to view server logs and debug any issues

### Additional Notes

- The free tier of Render has some limitations, including the PostgreSQL database being deleted after 90 days of inactivity
- For production use, consider upgrading to a paid plan
- Render automatically manages SSL certificates for your deployed applications
