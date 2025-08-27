import React, { useState } from 'react';

function AddUser({ onUserAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    father_name: '',
    father_mobile: '',
    relative_name: '',
    relative_mobile: '',
    spouse_name: '',
    spouse_mobile: '',
    id_number: '',
    b_number: '',
    s_id_number: '',
    v_number: '',
    admission_date: '',
    validity_date: '',
    total_amount: ''
  });
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (index, file) => {
    const newPhotos = [...photos];
    newPhotos[index] = file;
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile) {
      alert('Name and Mobile are required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke('add-user', {
          ...formData,
          total_amount: parseFloat(formData.total_amount) || 0
        });
        
        if (result.success) {
          alert('User added successfully!');
          onUserAdded();
        } else {
          alert('Failed to add user: ' + result.message);
        }
      } else {
        // Fallback for testing
        alert('User added successfully! (Demo mode)');
        onUserAdded();
      }
    } catch (error) {
      alert('Error adding user: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      father_name: '',
      father_mobile: '',
      relative_name: '',
      relative_mobile: '',
      spouse_name: '',
      spouse_mobile: '',
      id_number: '',
      b_number: '',
      s_id_number: '',
      v_number: '',
      admission_date: '',
      validity_date: '',
      total_amount: ''
    });
    setPhotos([null, null, null, null]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
        <button 
          onClick={resetForm}
          className="btn-secondary"
        >
          <i className="fas fa-undo mr-2"></i>
          Reset Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photos Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos (4 Required)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo {index}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(index - 1, e.target.files[0])}
                    className="hidden"
                    id={`photo-${index}`}
                  />
                  <label htmlFor={`photo-${index}`} className="cursor-pointer">
                    {photos[index - 1] ? (
                      <div className="text-green-600">
                        <i className="fas fa-check-circle text-2xl mb-2"></i>
                        <p className="text-sm">{photos[index - 1].name}</p>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <i className="fas fa-camera text-2xl mb-2"></i>
                        <p className="text-sm">Click to upload</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="input-field"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                required
                className="input-field"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Name
              </label>
              <input
                type="text"
                name="father_name"
                className="input-field"
                value={formData.father_name}
                onChange={handleInputChange}
                placeholder="Enter father's name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Mobile
              </label>
              <input
                type="tel"
                name="father_mobile"
                className="input-field"
                value={formData.father_mobile}
                onChange={handleInputChange}
                placeholder="Enter father's mobile"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                R.Name
              </label>
              <input
                type="text"
                name="relative_name"
                className="input-field"
                value={formData.relative_name}
                onChange={handleInputChange}
                placeholder="Enter R.Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                R.Mobile
              </label>
              <input
                type="tel"
                name="relative_mobile"
                className="input-field"
                value={formData.relative_mobile}
                onChange={handleInputChange}
                placeholder="Enter R.Mobile"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                S.Name
              </label>
              <input
                type="text"
                name="spouse_name"
                className="input-field"
                value={formData.spouse_name}
                onChange={handleInputChange}
                placeholder="Enter S.Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                S.Mobile #
              </label>
              <input
                type="tel"
                name="spouse_mobile"
                className="input-field"
                value={formData.spouse_mobile}
                onChange={handleInputChange}
                placeholder="Enter S.Mobile #"
              />
            </div>
          </div>
        </div>

        {/* Identification Numbers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Identification Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Number
              </label>
              <input
                type="text"
                name="id_number"
                className="input-field"
                value={formData.id_number}
                onChange={handleInputChange}
                placeholder="Enter ID number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                B Number
              </label>
              <input
                type="text"
                name="b_number"
                className="input-field"
                value={formData.b_number}
                onChange={handleInputChange}
                placeholder="Enter B number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                S.ID Number
              </label>
              <input
                type="text"
                name="s_id_number"
                className="input-field"
                value={formData.s_id_number}
                onChange={handleInputChange}
                placeholder="Enter S.ID number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                V Number
              </label>
              <input
                type="text"
                name="v_number"
                className="input-field"
                value={formData.v_number}
                onChange={handleInputChange}
                placeholder="Enter V number"
              />
            </div>
          </div>
        </div>

        {/* Dates and Amount */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates and Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admission Date
              </label>
              <input
                type="date"
                name="admission_date"
                className="input-field"
                value={formData.admission_date}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validity/Expiry Date
              </label>
              <input
                type="date"
                name="validity_date"
                className="input-field"
                value={formData.validity_date}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount
              </label>
              <input
                type="number"
                name="total_amount"
                step="0.01"
                min="0"
                className="input-field"
                value={formData.total_amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onUserAdded()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Adding User...
              </span>
            ) : (
              <span className="flex items-center">
                <i className="fas fa-user-plus mr-2"></i>
                Add User
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
