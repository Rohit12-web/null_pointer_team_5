import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AppRoutes from './routes';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppRoutes />
          <Chatbot />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
