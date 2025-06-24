import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { sendMessage } from './store/chatSlice';
import { getSocket } from './services/socket';

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, currentChatId, loading } = useSelector((state: RootState) => state.chat);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChatId) return;
    dispatch(sendMessage({ chatId: currentChatId, content: input, type: 'text' }) as any);
    // Emit via socket
    const socket = getSocket();
    if (socket) {
      socket.emit('sendMessage', { chatId: currentChatId, content: input, type: 'text' });
    }
    setInput('');
  };

  if (!currentChatId) {
    return <div className="chat-window empty">Select a chat to start messaging.</div>;
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg._id} className={msg.sender._id === user.id ? 'message own' : 'message'}>
              <span className="sender">{msg.sender.username}:</span> {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={!currentChatId}
        />
        <button type="submit" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  );
};

export default ChatWindow; 