import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';

import { AuthProvider } from './Context/AuthContext.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// ✅ DEFINE ROUTER (THIS WAS MISSING)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);