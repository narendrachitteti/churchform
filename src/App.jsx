import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import ManageUsersPage from './components/ManageUsersPage';
import FormBuilderPage from './components/FormBuilderPage';
import DataEntryForm from './components/DataEntryForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  // Mock authentication - in real app, this would connect to backend
  const handleLogin = (email, password, role) => {
    // Mock user data
    const mockUser = {
      id: '1',
      name: role === 'admin' ? 'Admin User' : 'Data Entry Person',
      email,
      role,
      dateAdded: new Date().toISOString(),
    };
    setCurrentUser(mockUser);
    setCurrentPage(role === 'admin' ? 'dashboard' : 'data-entry');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigation} />;
      case 'dashboard':
        return <AdminDashboard user={currentUser} onNavigate={handleNavigation} onLogout={handleLogout} />;
      case 'manage-users':
        return <ManageUsersPage user={currentUser} onNavigate={handleNavigation} onLogout={handleLogout} />;
      case 'form-builder':
        return <FormBuilderPage user={currentUser} onNavigate={handleNavigation} onLogout={handleLogout} />;
      case 'data-entry':
        return <DataEntryForm user={currentUser} onLogout={handleLogout} />;
      default:
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
    </div>
  );
}

export default App;