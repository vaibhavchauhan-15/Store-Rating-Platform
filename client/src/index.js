import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/theme.css'; // Import our custom theme
import App from './App';
import { 
  BrowserRouter, 
  createBrowserRouter, 
  RouterProvider,
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Enable future flags if available in environment
const futureFlagsValue = process.env.REACT_APP_ROUTER_FUTURE_FLAGS || '';
const futureFlags = {};
if (futureFlagsValue) {
  const flags = futureFlagsValue.split(',');
  flags.forEach(flag => {
    if (flag.trim()) {
      futureFlags[flag.trim()] = true;
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={futureFlags}>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
