import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from './store/authSlice';
import { RootState } from './store';

const Register: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ username, email, password }) as any);
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>Register</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>Already have an account? <button onClick={onSwitch}>Login</button></p>
    </div>
  );
};

export default Register; 