import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AppRoutes from './routes';
import Chatbot from './components/Chatbot';
import { useLenis } from './hooks/useLenis';

function App() {
  useLenis(); // Initialize Lenis smooth scrolling

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
