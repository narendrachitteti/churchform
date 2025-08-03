import React from 'react';
import Sidebar from './Sidebar';

const ViewMembersPage = ({ user, onNavigate, onLogout }) => {
  const [editIdx, setEditIdx] = React.useState(null);
  const [editData, setEditData] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);

  // Handle delete
  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    await fetch(`https://church-backendform.vercel.app/api/entries/${entryId}`, { method: 'DELETE' });
    setEntries(entries.filter(e => e._id !== entryId));
  };

  // Handle edit
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({ ...entries[idx].data });
    setShowModal(true);
  };

  // Handle update
  const handleUpdate = async (entry) => {
    await fetch(`https://church-backendform.vercel.app/api/entries/${entry._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: editData }),
    });
    // Update local state
    const updated = [...entries];
    updated[editIdx].data = { ...editData };
    setEntries(updated);
    setEditIdx(null);
    setEditData({});
    setShowModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => handleEdit(idx)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDelete(entry._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Member Entry</h3>
                <button
                  onClick={() => { setShowModal(false); setEditIdx(null); setEditData({}); }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={e => { e.preventDefault(); handleUpdate(entries[editIdx]); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input name="memberName" value={editData.memberName || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input name="email" value={editData.email || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Festival</label>
                  <input name="festival" value={editData.festival || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fees</label>
                  <input name="fees" type="number" value={editData.fees || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <input name="paymentStatus" value={editData.paymentStatus || ''} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditIdx(null); setEditData({}); }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
