import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, clearNotifications } from '../../store/notificationSlice';

const NotificationPanel = ({ onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="notification-panel">
      <div className="notification-panel-header">
        <h3>Notifications</h3>
        <div>
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="clear-all-btn"
              style={{ marginRight: '8px', fontSize: '12px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="close-notifications"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="notification-message">
                {notification.message}
              </div>
              <div className="notification-timestamp">
                {formatTimestamp(notification.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;