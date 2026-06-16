import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import '../style/chat.css';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  username: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  username
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>Trò chuyện</h3>
        <button className="chat-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            Không có tin nhắn nào. Hãy bắt đầu trò chuyện!
          </div>
        ) : (
          messages.map(msg => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="chat-message-system">
                  {msg.text}
                </div>
              );
            }

            const isSelf = msg.sender === username;

            return (
              <div
                key={msg.id}
                className={`chat-message-bubble-wrapper ${
                  isSelf ? 'self' : 'other'
                }`}
              >
                {!isSelf && <span className="chat-message-sender">{msg.sender}</span>}
                <div className={`chat-message-bubble ${isSelf ? 'self' : 'other'}`}>
                  <p>{msg.text}</p>
                  <span className="chat-message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          maxLength={200}
        />
        <button type="submit" disabled={!inputText.trim()}>
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatSidebar;
