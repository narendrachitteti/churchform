import React, { useState } from 'react';
import ReactWhatsapp from 'react-whatsapp';
import { Plus, Trash2, Save, LogOut, Church, User } from 'lucide-react';

const DataEntryForm = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    memberName: '',
    email: '',
    address: '',
    phoneNumber: '',
    alternatePhone: '',
    festival: '',
    fees: 0,
    denomination: '',
    paymentMode: '',
    paymentStatus: '',
  });

  const [familyMembers, setFamilyMembers] = useState([
    { id: '1', name: '', relationship: '' }
  ]);


  // Dynamic fields from form builder
  const [dynamicFields, setDynamicFields] = useState([]);

  // Mock dynamic options - fallback if not present in schema
  const festivals = ['Christmas', 'Easter', 'Thanksgiving', 'New Year'];
  const denominations = ['INR'];
  const paymentModes = ['Cash', 'Check', 'Credit Card', 'UPI', 'Bank Transfer'];
  const paymentStatuses = ['Paid', 'Pending','Part-payment'];

  React.useEffect(() => {
    // Fetch latest form schema from backend
    fetch('https://church-backendform.vercel.app/api/forms')
      .then(res => res.json())
      .then(forms => {
        if (forms && forms.length > 0) {
          // Use the latest form schema
          setDynamicFields(forms[forms.length - 1].fields || []);
        }
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-fill fees based on festival
    if (name === 'festival') {
      const feeMap = {
        'Christmas': 150,
        'Easter': 120,
        'Thanksgiving': 100,
        'New Year': 130,
      };
      setFormData(prev => ({
        ...prev,
        [name]: value,
        fees: feeMap[value] || 0,
      }));
    }
  };

  const handleFamilyMemberChange = (id, field, value) => {
    setFamilyMembers(familyMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const addFamilyMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const removeFamilyMember = (id) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(member => member.id !== id));
    }
  };

  const [lastEntryId, setLastEntryId] = useState(null);
  const [whatsappStatus, setWhatsappStatus] = useState(null);
  const [whatsappData, setWhatsappData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for backend
      const entryData = {
        data: formData,
        familyMembers: familyMembers.map(({ id, ...rest }) => rest),
      };
      // Optionally add user id if needed by backend
      // entryData.user = user.id;
      const response = await fetch('https://church-backendform.vercel.app/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Submission failed');
      setLastEntryId(data.entryId);
      setWhatsappStatus(null);
      // Build message with all entered details
      const details = Object.entries(formData)
        .filter(([key, val]) => val)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n');
      setWhatsappData({
        phone: formData.phoneNumber,
        message: `Hello ${formData.memberName}, your church entry has been saved!\nEntry ID: ${data.entryId}\n\nDetails:\n${details}`
      });
      alert(`Church member data submitted successfully!\nYour Entry ID: ${data.entryId}`);
      // Reset form
      setFormData({
        memberName: '',
        email: '',
        address: '',
        phoneNumber: '',
        alternatePhone: '',
        festival: '',
        fees: 0,
        denomination: '',
        paymentMode: '',
        paymentStatus: '',
      });
      setFamilyMembers([{ id: '1', name: '', relationship: '' }]);
    } catch (err) {
      setWhatsappStatus(null);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Church className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Grace Church</h1>
                <p className="text-sm text-gray-600">Member Data Entry</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-1 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Church Member Data Form</h2>
            <p className="text-gray-600">Please fill in all the required information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {lastEntryId && (
              <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg text-green-800">
                <strong>Entry ID:</strong> {lastEntryId}<br />
                {whatsappData && whatsappData.phone && (
                  <ReactWhatsapp
                    number={whatsappData.phone}
                    message={whatsappData.message}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Send WhatsApp Confirmation
                  </ReactWhatsapp>
                )}
              </div>
            )}
            {/* A. Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                A. Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-2">
                    Member Name *
                  </label>
                  <input
                    type="text"
                    id="memberName"
                    name="memberName"
                    value={formData.memberName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter complete address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* B. Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                B. Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Phone Number
                  </label>
                  <input
                    type="tel"
                    id="alternatePhone"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter alternate phone number"
                  />
                </div>
              </div>
            </div>

            {/* C. Family Members Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                C. Family Members Section
              </h3>
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-medium text-gray-900">Family Member {index + 1}</h4>
                      {familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(member.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleFamilyMemberChange(member.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter family member name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={member.relationship}
                          onChange={(e) => handleFamilyMemberChange(member.id, 'relationship', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="e.g., Spouse, Child, Parent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Another Family Member</span>
                </button>
              </div>
            </div>

            {/* D. Festival & Payment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                D. Festival & Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="festival" className="block text-sm font-medium text-gray-700 mb-2">
                    Festival *
                  </label>
                  <select
                    id="festival"
                    name="festival"
                    value={formData.festival}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select Festival</option>
                    {festivals.map((festival) => (
                      <option key={festival} value={festival}>{festival}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-2">
                    Fees
                  </label>
                  <input
                    type="number"
                    id="fees"
                    name="fees"
                    value={formData.fees}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="Auto-filled based on festival"
                  />
                </div>

                <div>
                  <label htmlFor="denomination" className="block text-sm font-medium text-gray-700 mb-2">
                    Denomination *
                  </label>
                  <select
                    id="denomination"
                    name="denomination"
                    value={formData.denomination}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select Denomination</option>
                    {denominations.map((denom) => (
                      <option key={denom} value={denom}>{denom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">
                    Mode of Payment *
                  </label>
                  <select
                    id="paymentMode"
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status *
                  </label>
                  <select
                    id="paymentStatus"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select Payment Status</option>
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
              {/* Dynamic Fields from Form Builder */}
            {dynamicFields.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Additional Fields (from Admin Form Builder)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dynamicFields.map((field, idx) => {
                    // Skip if field label already exists in hardcoded fields
                    if ([
                      'memberName','email','address','phoneNumber','alternatePhone','festival','fees','denomination','paymentMode','paymentStatus'
                    ].includes(field.label)) return null;
                    if (field.type === 'dropdown') {
                      return (
                        <div key={idx} className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <select
                            name={field.label}
                            required={field.required}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            value={formData[field.label] || ''}
                            onChange={e => setFormData({ ...formData, [field.label]: e.target.value })}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      );
                    } else if (field.type === 'textarea') {
                      return (
                        <div key={idx} className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <textarea
                            name={field.label}
                            required={field.required}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            value={formData[field.label] || ''}
                            onChange={e => setFormData({ ...formData, [field.label]: e.target.value })}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={idx} className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <input
                            type={field.type}
                            name={field.label}
                            required={field.required}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            value={formData[field.label] || ''}
                            onChange={e => setFormData({ ...formData, [field.label]: e.target.value })}
                            placeholder={`Enter ${field.label}`}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save & Send Church Data</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataEntryForm;