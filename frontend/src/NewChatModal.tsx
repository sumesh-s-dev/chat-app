import React, { useState } from 'react';
import { api } from './services/api';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const NewChatModal: React.FC<{ open: boolean; onClose: (chatId?: string) => void }> = ({ open, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const users = await api.searchUsers(query);
      setResults(users.filter((u: any) => user && u._id !== user._id));
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSelect = (u: any) => {
    if (!selected.find(s => s._id === u._id)) setSelected([...selected, u]);
  };
  const handleRemove = (u: any) => {
    setSelected(selected.filter(s => s._id !== u._id));
  };

  const handleCreate = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const isGroup = selected.length > 1;
      const res = await api.post('/chat', {
        userIds: selected.map(u => u._id),
        name: isGroup ? groupName : undefined,
        isGroup,
      });
      onClose(res._id);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Start a New Chat</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search users by username or email..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !query.trim()}>Search</button>
        </form>
        {error && <div className="error">{error}</div>}
        <div className="search-results">
          {results.map(u => (
            <div key={u._id} className="search-user">
              <span>{u.username} ({u.email})</span>
              <button onClick={() => handleSelect(u)} disabled={selected.find(s => s._id === u._id)}>Add</button>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="selected-users">
            <h4>Selected:</h4>
            {selected.map(u => (
              <span key={u._id} className="selected-user">
                {u.username}
                <button onClick={() => handleRemove(u)}>x</button>
              </span>
            ))}
          </div>
        )}
        {selected.length > 1 && (
          <input
            type="text"
            placeholder="Group name (required)"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            required
          />
        )}
        <div className="modal-actions">
          <button onClick={() => onClose()} disabled={loading}>Cancel</button>
          <button
            onClick={handleCreate}
            disabled={loading || selected.length === 0 || (selected.length > 1 && !groupName.trim())}
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal; 