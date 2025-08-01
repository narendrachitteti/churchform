import React from 'react';
import { Users, DollarSign, FileText, TrendingUp } from 'lucide-react';
import Sidebar from './Sidebar';
import { User } from '../types';

interface AdminDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate, onLogout }) => {
  const stats = [
    { title: 'Total Members', value: '1,247', icon: Users, color: 'blue', change: '+12%' },
    { title: 'Pending Payments', value: '23', icon: DollarSign, color: 'red', change: '-5%' },
    { title: 'Forms Created', value: '8', icon: FileText, color: 'green', change: '+2' },
    { title: 'This Month', value: '156', icon: TrendingUp, color: 'purple', change: '+18%' },
  ];

  const recentEntries = [
    { id: 1, name: 'John Smith', festival: 'Christmas', amount: '$150', status: 'Paid', date: '2025-01-15' },
    { id: 2, name: 'Mary Johnson', festival: 'Easter', amount: '$120', status: 'Pending', date: '2025-01-14' },
    { id: 3, name: 'David Brown', festival: 'Christmas', amount: '$200', status: 'Paid', date: '2025-01-13' },
    { id: 4, name: 'Sarah Wilson', festival: 'Thanksgiving', amount: '$100', status: 'Pending', date: '2025-01-12' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'red' ? 'bg-red-100' :
                      stat.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'red' ? 'text-red-600' :
                        stat.color === 'green' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
              <p className="text-gray-600 mt-1">Latest member data submissions</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Festival
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-700">
                              {entry.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{entry.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.festival}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;