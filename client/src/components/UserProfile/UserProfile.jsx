import React, { useEffect, useState } from 'react';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/user`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUser(data);

        const ordersResponse = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/orders?userId=${data._id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div>Error loading profile</div>;

  return (
    <div className="user-profile">
      <div className="profile-sidebar">
        <div className="profile-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-status">{user.membershipStatus || 'Regular Member'}</div>
      </div>

      <div className="profile-main">
        {/* Account Information */}
        <section className="profile-section">
          <h3 className="section-title"><FaUser /> Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Member Since</div>
              <div className="info-value">{new Date(user.dateJoined).toLocaleDateString()}</div>
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

        {/* Shipping Address */}
        <section className="profile-section">
          <h3 className="section-title"><FaMapMarkerAlt /> Shipping Address</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Address</div>
              <div className="info-value">{user.address || 'No address saved'}</div>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="profile-section">
          <h3 className="section-title"><FaHistory /> Recent Orders</h3>
          <div className="activity-list">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="activity-item">
                  <div className="activity-icon"><FaShoppingBag /></div>
                  <div className="activity-details">
                    <div className="activity-title">Order ID: {order._id}</div>
                    <div className="activity-date">{new Date(order.orderDate).toLocaleDateString()}</div>
                    <div className="activity-status">Status: {order.status}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent orders</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
