import React from 'react';
import { useSelector } from 'react-redux';

const Header = ({ user, onSignOut, onToggleNotifications, showNotifications }) => {
  const notifications = useSelector((state) => state.notifications.items);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="chat-header">
      <div className="header-left">
        <h2>Chat Application</h2>
      </div>
      
      <div className="header-right">
        <div className="credits-counter">
          <span>💰</span>
          <span>{user?.credits || 0} credits</span>
        </div>
        
        <button
          className="notification-icon"
          onClick={onToggleNotifications}
          aria-label="Notifications"
        >
          <span>🔔</span>
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>
        
        <button
          className="sign-out-btn"
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;