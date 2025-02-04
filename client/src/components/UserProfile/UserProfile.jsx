import React, { useEffect, useState } from 'react';
import { FaUser, FaShoppingBag, FaGamepad, FaWallet, FaHistory, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);

        // Fetch recent activity (orders, rentals, etc.)
        const activityResponse = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/user/activity`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (!user) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          {user.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-status">
          {user.membershipStatus || 'Regular Member'}
        </div>
      </div>

      <div className="profile-main">
        <section className="profile-section">
          <h3 className="section-title">
            <FaUser /> Account Information
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Member Since</div>
              <div className="info-value">
                {new Date(user.dateJoined).toLocaleDateString()}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Phone Number</div>
              <div className="info-value">{user.mobile || 'Not set'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Wallet Balance</div>
              <div className="info-value">₹{user.wallet?.toLocaleString() || '0'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Total Orders</div>
              <div className="info-value">{user.totalOrders || '0'}</div>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3 className="section-title">
            <FaMapMarkerAlt /> Shipping Address
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Address</div>
              <div className="info-value">
                {user.address || 'No address saved'}
              </div>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3 className="section-title">
            <FaHistory /> Recent Activity
          </h3>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'purchase' ? <FaShoppingBag /> : 
                     activity.type === 'rental' ? <FaGamepad /> : 
                     activity.type === 'wallet' ? <FaWallet /> : <FaClock />}
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">{activity.description}</div>
                    <div className="activity-date">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent activity</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
