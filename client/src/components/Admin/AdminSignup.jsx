import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Import the SignIn.css for styling

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Implement your signup logic here
    const apiUrl = import.meta.env.VITE_PROD_BASE_URL + '/admin/signup'; // Use the production URL from the environment variable
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send email and password
    });

    if (response.ok) {
      alert('Signup successful! You can now log in.');
      navigate('/admin/login'); // Redirect to login page
    } else {
      const errorData = await response.json(); // Get error message from response
      alert(`Signup failed: ${errorData.error || 'Please try again.'}`); // Display error message
    }
  };

  return (
    <div className="admin-signup-container sign-in-container"> {/* Added sign-in-container class for styling */}
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Sign Up</button>
      </form>
      <div className="redirect-link">
        <p>Already have an account? <button onClick={() => navigate('/admin/login')} className="btn-primary">Login</button></p>
      </div>
    </div>
  );
};

export default AdminSignup; 