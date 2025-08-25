# Store Rating Platform - Backend Deployment Guide for Render

## Deploying to Render

This guide walks through the steps to deploy the backend API to Render.

### Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Git repository with your code (GitHub, GitLab, etc.)

### Deployment Steps

#### Option 1: Using render.yaml (Blueprint) - Recommended

1. Push your code to GitHub
2. In your Render dashboard, click on "New" and select "Blueprint"
3. Connect your GitHub account and select this repository
4. Render will automatically detect the `render.yaml` file and set up your services
5. Click "Apply" to start the deployment
6. Once deployment is complete, Render will provide you with a URL for your API

#### Option 2: Manual Setup

1. **Create a PostgreSQL Database**:
   - From your Render dashboard, click "New" and select "PostgreSQL"
   - Name it "store-rating-db"
   - Choose a region and plan (Free tier is available)
   - Click "Create Database"
   - Note down the Internal Database URL (connection string)

2. **Deploy the Web Service**:
   - From your Render dashboard, click "New" and select "Web Service"
   - Connect to your repository
   - Fill in the details:
     - Name: store-rating-platform-backend
     - Root Directory: server (important - select the server directory)
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
   - In the "Environment Variables" section, add the following:
     - `NODE_ENV`: production
     - `PORT`: 10000
     - `DATABASE_URL`: (the Internal Database URL from your Render PostgreSQL)
     - `JWT_SECRET`: (generate a secure random string)
   - Click "Create Web Service"

### Troubleshooting

If you encounter deployment issues, check the following:

1. **Database Connection**:
   - Ensure your PostgreSQL database is created and running
   - Check the DATABASE_URL environment variable is correctly set
   - The backend is configured to handle SSL connections required by Render

2. **Missing Client Files**:
   - The backend is configured to serve API endpoints only in this deployment
   - If you want to serve the frontend from the same service, you'll need to build the client and include it

3. **Server Logs**:
   - Check the logs in your Render dashboard for specific error messages
   - Common errors include database connection issues or missing environment variables

### Testing Your Deployment

After successful deployment, you can test your API with tools like Postman or curl:

```
curl https://your-service-name.onrender.com/api/status
```

You should get a response like:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Environment Variables

Your backend requires the following environment variables:

- `NODE_ENV`: Set to 'production' for deployment
- `PORT`: The port your server will run on (default: 10000 on Render)
- `DATABASE_URL`: The full PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation/validation

### Separate Frontend Deployment

To deploy the frontend separately:

1. In the client directory, update API URLs to point to your deployed backend
2. Deploy the React frontend to a service like Netlify, Vercel, or another Render Web Service
3. Configure CORS in the backend if needed (already set up in the code)

### Additional Notes

- The free tier of Render has some limitations, including the PostgreSQL database being deleted after 90 days of inactivity
- For production use, consider upgrading to a paid plan
- Render automatically manages SSL certificates for your deployed applications
