import React, { useEffect, useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
    
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <div className="profile-info">
        <p>Email: {user.email}</p>
        <p>Address: {user.address || 'Address not set'}</p>
        <p>Mobile: {user.mobile || 'Not set'}</p>
        <p>Date Joined: {new Date(user.dateJoined).toLocaleDateString() || 'Not available'}</p>
        <p>Wallet: ${user.wallet || 0}</p>
      </div>
    </div>
  );
};

export default UserProfile;
