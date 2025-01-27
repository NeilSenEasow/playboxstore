import React, { useState } from 'react';
import './SignIn.css'; // Import your CSS
import { Link, useNavigate } from 'react-router-dom';

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Initialize error as null
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading state

    console.log('Submitting sign-in with:', { email, password }); // Log the credentials being sent

    try {
      const apiUrl = import.meta.env.VITE_PROD_BASE_URL + '/auth/login' || import.meta.env.VITE_API_URL + '/auth/login'; // Use environment variables
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Sign In failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage; // Extract message if available
        } catch (jsonError) {
          console.error("Error parsing error JSON:", jsonError);
          if (response.status === 400) {
            errorMessage = "Invalid Credentials";
          }
        }
        throw new Error(errorMessage); // Throw the extracted error message
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token immediately
      if (onSignIn) {
        onSignIn(data.token);
      }
      navigate('/');
    } catch (err) {
      console.error('Sign-in error:', err);
      setError(err.message); // Set the error message in state
    } finally {
      setIsLoading(false); // Reset loading state regardless of success/failure
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
      {error && <div className="error-message">{error}</div>} {/* Use a div for better styling */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading} // Disable input while loading
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading} // Disable input while loading
        />
        <button type="submit" disabled={isLoading}> {/* Disable button while loading */}
          {isLoading ? 'Signing In...' : 'Sign In'} {/* Show loading message */}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup" className="redirect-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;