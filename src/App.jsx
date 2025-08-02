
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import ManageUsersPage from './components/ManageUsersPage';
import FormBuilderPage from './components/FormBuilderPage';
import DataEntryForm from './components/DataEntryForm';
import ViewMembersPage from './components/ViewMembersPage';



function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Try to load user from localStorage on first render
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    // If user exists, go to their default page, else login
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.role === 'admin' ? 'dashboard' : 'data-entry';
    }
    return 'login';
  });

  // Save user to localStorage on login
  const handleLogin = async (email, password, role) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setCurrentPage(data.user.role === 'admin' ? 'dashboard' : 'data-entry');
    } catch (err) {
      alert(err.message);
    }
  };

  // Remove user from localStorage on logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  // Optionally, sync state with localStorage if user manually clears storage
  useEffect(() => {
    const handleStorage = () => {
      const user = localStorage.getItem('currentUser');
      if (!user) {
        setCurrentUser(null);
        setCurrentPage('login');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
      case 'view-members':
        return <ViewMembersPage user={currentUser} onNavigate={handleNavigation} onLogout={handleLogout} />;
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