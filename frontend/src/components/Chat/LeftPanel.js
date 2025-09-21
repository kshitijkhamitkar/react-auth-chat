import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectChat } from '../../store/chatSlice';

const LeftPanel = () => {
  const dispatch = useDispatch();
  const { chats, activeChat } = useSelector((state) => state.chat);

  const handleChatSelect = (chatId) => {
    dispatch(selectChat(chatId));
  };

  return (
    <div className="left-panel">
      <h3>Conversations</h3>
      
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
            onClick={() => handleChatSelect(chat.id)}
          >
            <div className="chat-title">{chat.title}</div>
            <div className="chat-preview">{chat.lastMessage}</div>
          </div>
        ))}
        
        {chats.length === 0 && (
          <div className="empty-state">
            <p>No conversations yet. Start a new chat!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;