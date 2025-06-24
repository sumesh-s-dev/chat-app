import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { sendMessage } from './store/chatSlice';
import { getSocket } from './services/socket';
import { api } from './services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, currentChatId, loading } = useSelector((state: RootState) => state.chat);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !file) || !currentChatId) return;
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('chatId', currentChatId);
      formData.append('file', file);
      if (input.trim()) formData.append('content', input);
      try {
        const res = await fetch(`${API_URL}/message`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Upload failed');
        setFile(null);
        setInput('');
      } catch (err) {
        // Optionally show error
      }
      setUploading(false);
      return;
    }
    dispatch(sendMessage({ chatId: currentChatId, content: input, type: 'text' }) as any);
    // Emit via socket
    const socket = getSocket();
    if (socket) {
      socket.emit('sendMessage', { chatId: currentChatId, content: input, type: 'text' });
    }
    setInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
            <div key={msg._id} className={user && msg.sender._id === user._id ? 'message own' : 'message'}>
              <span className="sender">{msg.sender.username}:</span>
              {msg.type === 'image' && msg.fileUrl ? (
                <img src={msg.fileUrl.startsWith('http') ? msg.fileUrl : `${API_URL.replace('/api','')}${msg.fileUrl}`} alt={msg.content} className="chat-image" />
              ) : msg.type === 'file' && msg.fileUrl ? (
                <a href={msg.fileUrl.startsWith('http') ? msg.fileUrl : `${API_URL.replace('/api','')}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">{msg.content || 'File'}</a>
              ) : (
                msg.content
              )}
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
          disabled={!currentChatId || uploading}
        />
        <input
          type="file"
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-zip-compressed,application/octet-stream"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {file && <span className="file-preview">{file.name}</span>}
        <button type="submit" disabled={(!input.trim() && !file) || uploading}>Send</button>
      </form>
      {uploading && <div className="loading">Uploading...</div>}
    </div>
  );
};

export default ChatWindow; 