import React, { useState } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './LiveChat.css';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! How can we help you today?", isBot: true }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { text: message, isBot: false };
    setMessages([...messages, userMsg]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! Our team will get back to you shortly.", 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <div className={`live-chat-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <FaComments size={24} />
          <span className="chat-badge-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window shadow-2xl">
          <div className="chat-header">
            <div className="header-info">
              <div className="online-indicator"></div>
              <h3>Exclusive Support</h3>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form className="chat-footer" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-btn">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
