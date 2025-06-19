// src/SignupPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore
import { db } from './firebase'; // Import Firebase config

import './SignupPage.css'; // Ensure this CSS file exists for styling

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Full Name for user profile
  const [signupError, setSignupError] = useState<string | null>(null); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const navigate = useNavigate();
  const auth = getAuth(); // Get the auth instance

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setSignupError(null); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      // 1. Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create a user profile document in Firestore
      // Use the user's UID as the document ID for easy lookup
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid, // Store UID explicitly
        email: user.email,
        fullName: name, // Store the full name
        createdAt: serverTimestamp(), // Timestamp for when the user was created
        lastLogin: serverTimestamp(), // Initial last login time
      });

      console.log('Signup successful and user profile created in Firestore!');
      // After successful signup and profile creation, navigate to the bookstore page
      navigate('/bookstore', { replace: true }); // <--- CHANGED THIS LINE

    } catch (error: any) {
      console.error('Signup error:', error);
      // Display a user-friendly error message based on Firebase error codes
      let errorMessage = 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please log in or use a different email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password (at least 6 characters).';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Contact support.';
      }
      setSignupError(errorMessage);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>K.I.D.S</h2>
        <h4>Kustomized Illustrated Digital Stories</h4>
        <h3>Create Your Account</h3>
        <form onSubmit={handleSignup}>
          <div className="form-group"> {/* Added form-group for styling */}
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
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              id="name"
              type="text"
              placeholder="Enter full name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              disabled={isLoading}
            />
          </div>

          {signupError && <p className="error-message">{signupError}</p>} {/* Display error message */}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'SIGN UP'}
          </button>
        </form>
        <p className="login-link"> {/* Added class for styling */}
          Already have an account? <Link to="/login">LOG IN</Link> {/* Used Link component */}
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
