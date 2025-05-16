import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Chat from './components/Chat';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  return (
    <div className="App" style={{ padding: 20 }}>
      <header>
        <h2>Welcome, {user.attributes?.email || user.username} 👋</h2>
        <button onClick={signOut}>Sign Out</button>
      </header>
      <Chat />
    </div>
  );
}

// Explicitly require email on signup using formFields
export default withAuthenticator(App, {
  signUpAttributes: ['email']
});
