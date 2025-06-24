import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/authSlice';
import { RootState } from './store';

const Login: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }) as any);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>Login</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>Don't have an account? <button onClick={onSwitch}>Register</button></p>
    </div>
  );
};

export default Login; 