import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../../store/chatSlice';
import { updateCredits } from '../../store/authSlice';
import { addNotification } from '../../store/notificationSlice';
import api from '../../services/api';

const MessageList = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    // Check if user has credits
    if (user.credits <= 0) {
      dispatch(addNotification({
        id: Date.now(),
        message: 'Insufficient credits! You need credits to send messages.',
        timestamp: new Date().toISOString(),
        read: false
      }));
      return;
    }

    const messageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message immediately
    dispatch(addMessage({
      id: Date.now(),
      text: messageText,
      timestamp: new Date().toISOString(),
      sender: 'user'
    }));

    try {
      // Send message to backend (this decreases credits)
      const response = await api.post('/auth/send-message', {
        message: messageText
      });

      // Update credits in Redux store
      dispatch(updateCredits(response.data.credits));

      // Add AI response
      dispatch(addMessage({
        id: Date.now() + 1,
        text: response.data.aiResponse,
        timestamp: new Date().toISOString(),
        sender: 'ai'
      }));

      // Add low credits notification if applicable
      if (response.data.credits <= 10 && response.data.credits > 0) {
        dispatch(addNotification({
          id: Date.now() + 2,
          message: `Low credits warning! You have ${response.data.credits} credits remaining.`,
          timestamp: new Date().toISOString(),
          read: false
        }));
      } else if (response.data.credits === 0) {
        dispatch(addNotification({
          id: Date.now() + 2,
          message: 'You have run out of credits! Please purchase more to continue.',
          timestamp: new Date().toISOString(),
          read: false
        }));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle error cases
      if (error.response?.data?.message) {
        dispatch(addMessage({
          id: Date.now() + 1,
          text: `Error: ${error.response.data.message}`,
          timestamp: new Date().toISOString(),
          sender: 'system'
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <>
      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === 'user' 
                ? 'sent' 
                : message.sender === 'system' 
                ? 'system' 
                : 'received'
            }`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message received loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              AI is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            user.credits <= 0 
              ? "You need credits to send messages..." 
              : "Type your message..."
          }
          className="message-input"
          rows="1"
          disabled={isLoading || user.credits <= 0}
        />
        <div className="input-footer">
          <div className="credits-info">
            <span className={`credits-badge ${user.credits <= 10 ? 'low' : ''}`}>
              💰 {user.credits} credits
            </span>
            {user.credits <= 0 && (
              <span className="no-credits-warning">
                No credits remaining
              </span>
            )}
          </div>
          <button
            type="submit"
            className="send-button"
            disabled={!inputValue.trim() || isLoading || user.credits <= 0}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageList;


// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { addMessage } from '../../store/chatSlice';

// const MessageList = () => {
//   const dispatch = useDispatch();
//   const { messages } = useSelector((state) => state.chat);
//   const [inputValue, setInputValue] = useState('');
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
    
//     if (inputValue.trim()) {
//       dispatch(addMessage({
//         id: Date.now(),
//         text: inputValue.trim(),
//         timestamp: new Date().toISOString(),
//         sender: 'user'
//       }));
      
//       setInputValue('');
      
//       // Simulate AI response
//       setTimeout(() => {
//         dispatch(addMessage({
//           id: Date.now() + 1,
//           text: `I received your message: "${inputValue.trim()}". This is a sample response.`,
//           timestamp: new Date().toISOString(),
//           sender: 'ai'
//         }));
//       }, 1000);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage(e);
//     }
//   };

//   return (
//     <>
//       <div className="message-list">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}
//           >
//             <div className="message-content">{message.text}</div>
//             <div className="message-timestamp">
//               {new Date(message.timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit'
//               })}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form onSubmit={handleSendMessage} className="message-input-container">
//         <textarea
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type your message..."
//           className="message-input"
//           rows="1"
//         />
//         <button
//           type="submit"
//           className="send-button"
//           disabled={!inputValue.trim()}
//         >
//           Send
//         </button>
//       </form>
//     </>
//   );
// };

// export default MessageList;