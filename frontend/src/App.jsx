import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <div className="flex flex-1">
            <Sidebar />

            <main className="flex-1 p-4 bg-gray-100">
              <AppRoutes />
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
