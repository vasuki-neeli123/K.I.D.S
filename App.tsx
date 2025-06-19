// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { auth } from './firebase';

// Import your page components based on your project structure:
import HomePage from './pages/HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

import CustomerDetails from './pages/Orderss/CustomerDetails';
import ChildDetails from './pages/Orderss/ChildDetails';
import ImageUpload from './pages/Orderss/ImageUpload';
import Payment from './pages/Orderss/Payment';
import Pricing from './pages/Orderss/Pricing';
// import StoryBook from './pages/Orderss/StoryBook'; // Removed as per your request

import Bookstore from './pages/Bookstore';
import MyOrders from './pages/MyOrders';
import Order from './pages/Orderss/Order'; // If this is a component you want to use
import BookDetail from './pages/BookDetail';
import GenreBooks from './pages/GenreBooks'; // ⭐ NEW IMPORT ⭐



import './App.css';

// Helper component for nested protected routes (required by react-router-dom v6 for Outlet)
const OrderFlowOutlet = () => <Outlet />;

function App() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<any>(null); // State to hold Firebase user

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser); // Set the user state based on Firebase's report
      setLoadingAuth(false); // Authentication state is loaded
    });
    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, []);

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>
        Loading application...
      </div>
    );
  }

  return (
    <div className="App-container"> {/* A div to wrap all content, could be a shared layout */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} /> {/* Your landing page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/book-detail/:id" element={<BookDetail />} />
        <Route path="/genre-books/:genreName" element={<GenreBooks />} />

        {/* Protected Order Flow Routes: Only accessible if user is logged in */}
        <Route path="/order" element={user ? <OrderFlowOutlet /> : <Navigate to="/login" replace />} > {/* Fixed here */}
            <Route path="customer-details" element={<CustomerDetails />} />
            <Route path="child-details" element={<ChildDetails />} />
            <Route path="image-upload" element={<ImageUpload />} />
            <Route path="payment" element={<Payment />} />
            <Route path="pricing" element={<Pricing />} />
            {/* <Route path="storybook" element={<StoryBook />} /> // Removed as per your request */}
            <Route path="" element={<Navigate to="customer-details" replace />} /> {/* Default for /order */}
        </Route>

        {/* Other Authenticated Routes */}
        <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" replace />} /> {/* Fixed here */}
        <Route path="/bookstore" element={user ? <Bookstore /> : <Navigate to="/login" replace />} /> {/* Fixed here */}

        {/* Catch-all for undefined routes */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>404 - Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => window.location.href = user ? "/order/customer-details" : "/login"}>
              Go to Home / Start Order
            </button>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;