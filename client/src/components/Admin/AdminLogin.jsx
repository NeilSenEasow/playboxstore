import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Import the SignIn.css for styling

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your login logic here
    // For example, send a request to your backend to authenticate the admin
    const response = await fetch('http://localhost:5001/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      onLogin(data.token); // Assuming the token is returned on successful login
      navigate('/admin'); // Redirect to the admin dashboard
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="admin-login-container sign-in-container"> {/* Added sign-in-container class for styling */}
      <h2>Admin Login</h2>
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
        <button type="submit" className="btn-primary">Login</button>
      </form>
      <div className="redirect-link">
        <p>Don't have an account? <button onClick={() => navigate('/admin/signup')} className="btn-primary">Sign Up</button></p>
      </div>
    </div>
  );
};

export default AdminLogin; 