import React from 'react';
import Sidebar from './Sidebar';

const ViewMembersPage = ({ user, onNavigate, onLogout }) => {
  const [entries, setEntries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('https://church-backendform.vercel.app/api/entries')
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} currentPage="view-members" onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">All Members</h1>
          <p className="text-gray-600 mt-1">List of all member data submissions</p>
        </div>
        <div className="p-8">
          {loading ? (
            <p>Loading...</p>
          ) : entries.length === 0 ? (
            <p>No member entries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Festival</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry, idx) => (
                    <tr key={entry._id || idx}>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.data?.memberName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.data?.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.data?.festival || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.data?.fees ? `$${entry.data.fees}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.data?.paymentStatus || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMembersPage;
