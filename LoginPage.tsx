// src/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Added useLocation and Link
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Added serverTimestamp
import { db } from './firebase'; // Import Firebase config

import './LoginPage.css'; // Ensure this CSS file exists for styling

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const navigate = useNavigate();
  const location = useLocation(); // To get the state from where the user was redirected

  const auth = getAuth(); // Get the auth instance

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoginError(null); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user exists in Firestore (Optional: for user profiles)
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // If user doesn't exist in Firestore, create a new record
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: serverTimestamp(), // Use serverTimestamp for creation time
          lastLogin: serverTimestamp(), // Use serverTimestamp for last login
        }, { merge: true }); // Use merge: true to avoid overwriting existing data if it exists
        console.log('New user record created in Firestore!');
      } else {
        // If user exists, update their last login time
        await setDoc(userDocRef, {
          lastLogin: serverTimestamp(),
        }, { merge: true });
        console.log('User last login updated in Firestore!');
      }

      // Determine where to navigate after successful login
      // If there's a 'from' state (e.g., user was trying to access a protected route)
      const from = location.state?.from?.pathname || '/bookstore'; // Default to customer details if no 'from'
      navigate(from, { replace: true }); // Navigate back to the intended page, replacing history entry

    } catch (error: any) {
      console.error('Login error:', error);
      // Display a user-friendly error message based on Firebase error codes
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.';
      }
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          {loginError && <p className="error-message">{loginError}</p>} {/* Display error message */}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'LOG IN'}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
