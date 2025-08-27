import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import AddUser from './components/AddUser';
import UserDetail from './components/UserDetail';

// Add debugging
console.log('App.js loaded successfully');
console.log('React version:', React.version);

// Simple Sidebar component
function Sidebar({ onViewChange, currentView, onLogout }) {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>
      
      <nav className="mt-6">
        <div 
          className={`p-4 cursor-pointer hover:bg-gray-100 ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
          onClick={() => onViewChange('dashboard')}
        >
          <i className="fas fa-tachometer-alt mr-3"></i>
          Dashboard
        </div>
        
        <div 
          className={`p-4 cursor-pointer hover:bg-gray-100 ${currentView === 'users' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
          onClick={() => onViewChange('users')}
        >
          <i className="fas fa-users mr-3"></i>
          Users
        </div>
        
        <div 
          className={`p-4 cursor-pointer hover:bg-gray-100 ${currentView === 'add-user' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
          onClick={() => onViewChange('add-user')}
        >
          <i className="fas fa-user-plus mr-3"></i>
          Add User
        </div>
        
        {/* Logout button */}
        <div className="mt-auto p-6">
          <button 
            onClick={onLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  


  const handleLogin = async (username, password) => {
    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke('login', username, password);
        if (result.success) {
          setIsLoggedIn(true);
          setCurrentUser(result.user);
          console.log('Login successful, user:', result.user);
        } else {
          alert(result.message);
        }
      } else {
        // Fallback for testing
        if (username === 'admin' && password === 'admin123') {
          setIsLoggedIn(true);
          setCurrentUser({ id: 1, username: 'admin' });
          console.log('Login successful (demo mode), user:', { id: 1, username: 'admin' });
        } else {
          alert('Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedUserId(null);
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '420px',
          width: '100%'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
            }}>
              <i className="fas fa-users" style={{color: 'white', fontSize: '24px'}}></i>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              User Management System
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Sign in to your account
            </p>
          </div>
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onViewChange={setCurrentView} currentView={currentView} onLogout={handleLogout} />
      
              {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'users' && <Users onUserClick={(userId) => {
              setSelectedUserId(userId);
              setCurrentView('user-detail');
            }} />}
            {currentView === 'add-user' && <AddUser onUserAdded={() => setCurrentView('users')} />}
            {currentView === 'user-detail' && selectedUserId && <UserDetail userId={selectedUserId} onBack={() => setCurrentView('users')} />}
          </div>
        </div>
      
      {/* Logout button moved to sidebar */}
    </div>
  );
}

export default App;
