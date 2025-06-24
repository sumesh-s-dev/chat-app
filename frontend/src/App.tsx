import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setUser } from './store/authSlice';
import Login from './Login';
import Register from './Register';
import './App.css';
import { api, setToken } from './services/api';

function App() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [showRegister, setShowRegister] = useState(false);

  // On mount, if token exists but no user, fetch user info
  useEffect(() => {
    if (token && !user) {
      setToken(token);
      api.get('/user/me')
        .then((u) => dispatch(setUser(u)))
        .catch(() => {});
    }
  }, [token, user, dispatch]);

  if (!token || !user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  // Placeholder for chat UI
  return (
    <div className="App">
      <header className="App-header">
        <h2>Welcome, {user.username}!</h2>
        <p>Chat UI coming soon...</p>
      </header>
    </div>
  );
}

export default App;
