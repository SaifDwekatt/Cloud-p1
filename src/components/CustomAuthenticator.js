import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

export default function CustomAuthenticator({ onSignIn }) {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signUp = async () => {
    setError(null);
    try {
      await Auth.signUp({
        username: form.username,
        password: form.password,
        attributes: {
          email: form.email,
        },
      });
      alert('Sign up successful! Please confirm your email before signing in.');
      setIsSigningUp(false);
    } catch (err) {
      setError(err.message || 'Error signing up');
    }
  };

  const signIn = async () => {
    setError(null);
    try {
      await Auth.signIn(form.username, form.password);
      onSignIn();
    } catch (err) {
      setError(err.message || 'Error signing in');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: 'auto' }}>
      <h2>{isSigningUp ? 'Sign Up' : 'Sign In'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={onChange}
        style={{ width: '100%', marginBottom: 10 }}
      />

      {isSigningUp && (
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          style={{ width: '100%', marginBottom: 10 }}
        />
      )}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={onChange}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <button onClick={isSigningUp ? signUp : signIn} style={{ width: '100%', padding: 10 }}>
        {isSigningUp ? 'Sign Up' : 'Sign In'}
      </button>

      <p style={{ marginTop: 10, cursor: 'pointer', color: 'blue' }} onClick={() => setIsSigningUp(!isSigningUp)}>
        {isSigningUp ? 'Already have an account? Sign In' : 'No account? Sign Up'}
      </p>
    </div>
  );
}
