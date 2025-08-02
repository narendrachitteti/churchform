import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, User, Mail, Lock } from 'lucide-react';
import Sidebar from './Sidebar';

const ManageUsersPage = ({ user, onNavigate, onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [dataEntryUsers, setDataEntryUsers] = useState([]);

  // Fetch users from backend
  React.useEffect(() => {
    fetch('https://church-backendform.vercel.app/api/users')
      .then(res => res.json())
      .then(data => setDataEntryUsers(data.map(u => ({
        ...u,
        id: u._id,
      }))))
      .catch(() => setDataEntryUsers([]));
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '' });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`https://church-backendform.vercel.app/api/users/${userId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        setDataEntryUsers(dataEntryUsers.filter(u => u.id !== userId));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const res = await fetch(`https://church-backendform.vercel.app/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email }),
        });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        setDataEntryUsers(dataEntryUsers.map(u => u.id === editingUser.id ? { ...u, ...updated } : u));
      } else {
        // Add new user
        const res = await fetch('https://church-backendform.vercel.app/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
        });
        if (!res.ok) throw new Error('Add failed');
        const newUser = await res.json();
        setDataEntryUsers([...dataEntryUsers, { ...newUser, id: newUser._id }]);
      }
      setShowModal(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} currentPage="manage-users" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-600 mt-1">Manage data entry personnel</p>
            </div>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataEntryUsers.map((userData) => (
                    <tr key={userData.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-700">
                              {userData.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{userData.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userData.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(userData.dateAdded).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(userData)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userData.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter password"
                      required={!editingUser}
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    {editingUser ? 'Update' : 'Add'} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;