import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../store/authSlice';
import LeftPanel from './LeftPanel';
import MessageList from './MessageList';
import Header from '../Layout/Header';
import NotificationPanel from '../Layout/NotificationPanel';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="chat-container">
      <Header 
        user={user}
        onSignOut={handleSignOut}
        onToggleNotifications={toggleNotifications}
        showNotifications={showNotifications}
      />
      
      <div className="chat-main">
        <LeftPanel />
        <div className="chat-content">
          <MessageList />
        </div>
      </div>
      
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default ChatWindow;