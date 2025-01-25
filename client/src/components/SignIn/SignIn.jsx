import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/signin', { // Use relative path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Log the response for debugging
      console.log('Response:', response);

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.text(); // Get the response as text
        console.error('Error response:', errorData); // Log the error response
        setError('Sign In failed: ' + errorData);
        return;
      }

      const data = await response.json();

      if (data) {
        onSignIn(data.token); // Assuming the backend returns a token
        navigate('/'); // Redirect to home or another page after sign-in
      }
    } catch (err) {
      console.error('Error during sign in:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup" className="redirect-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn; 