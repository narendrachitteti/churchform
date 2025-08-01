import React, { useState } from 'react';
import { Plus, Eye, Trash2, GripVertical, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { User, FormField } from '../types';

interface FormBuilderPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const FormBuilderPage: React.FC<FormBuilderPageProps> = ({ user, onNavigate, onLogout }) => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'date', label: 'Date Input' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'textarea', label: 'Text Area' },
  ];

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const saveSchema = () => {
    alert('Form schema saved successfully!');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} currentPage="form-builder" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
              <p className="text-gray-600 mt-1">Create dynamic forms for data entry</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Eye className="h-5 w-5" />
                <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
              </button>
              <button
                onClick={saveSchema}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Schema
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Form Builder */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} p-6`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Form Fields</h2>
              
              {/* Field Type Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {fieldTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addField(type.value as FormField['type'])}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mx-auto mb-1" />
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Form Fields List */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-900">Form Fields</h3>
                {formFields.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No fields added yet. Click buttons above to add fields.</p>
                ) : (
                  formFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">Field {index + 1}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                            {field.type}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteField(field.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Label
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Required field</label>
                        </div>

                        {field.type === 'dropdown' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Options (one per line)
                            </label>
                            <textarea
                              value={field.options?.join('\n') || ''}
                              onChange={(e) => updateField(field.id, { 
                                options: e.target.value.split('\n').filter(opt => opt.trim()) 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Preview Pane */}
          {showPreview && (
            <div className="w-1/2 p-6 border-l border-gray-200">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Preview</h2>
                
                {formFields.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Add fields to see preview</p>
                ) : (
                  <form className="space-y-4">
                    {formFields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            disabled
                          />
                        ) : field.type === 'dropdown' ? (
                          <div className="relative">
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                              disabled
                            >
                              <option>Select {field.label.toLowerCase()}</option>
                              {field.options?.map((option, idx) => (
                                <option key={idx} value={option}>{option}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            disabled
                          />
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Submit Form (Preview)
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;