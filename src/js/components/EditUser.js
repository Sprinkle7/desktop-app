import React, { useState, useEffect } from 'react';

function EditUser({ userData, onSave, onCancel }) {
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

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        mobile: userData.mobile || '',
        father_name: userData.father_name || '',
        father_mobile: userData.father_mobile || '',
        relative_name: userData.relative_name || '',
        relative_mobile: userData.relative_mobile || '',
        spouse_name: userData.spouse_name || '',
        spouse_mobile: userData.spouse_mobile || '',
        id_number: userData.id_number || '',
        b_number: userData.b_number || '',
        s_id_number: userData.s_id_number || '',
        v_number: userData.v_number || '',
        admission_date: userData.admission_date || '',
        validity_date: userData.validity_date || '',
        total_amount: userData.total_amount || ''
      });
    }
  }, [userData]);

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
        
        // First update user information
        const userResult = await ipcRenderer.invoke('update-user', {
          userId: userData.id,
          ...formData,
          total_amount: parseFloat(formData.total_amount) || 0
        });
        
        if (!userResult.success) {
          alert('Failed to update user: ' + userResult.message);
          return;
        }
        
        // Then handle photo uploads if there are any
        const photosToUpload = photos.filter(photo => photo !== null);
        if (photosToUpload.length > 0) {
          // Convert File objects to data that can be sent via IPC
          const photoData = [];
          for (let i = 0; i < photos.length; i++) {
            if (photos[i]) {
              const file = photos[i];
              const arrayBuffer = await file.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);
              photoData.push({
                name: file.name,
                data: Array.from(uint8Array) // Convert to regular array for IPC
              });
            } else {
              photoData.push(null);
            }
          }
          
          const photoResult = await ipcRenderer.invoke('upload-photos', {
            userId: userData.id,
            photos: photoData
          });
          
          if (!photoResult.success) {
            alert('User updated but failed to upload photos: ' + photoResult.message);
          }
        }
        
        alert('User updated successfully!');
        onSave();
      } else {
        // Fallback for testing
        alert('User updated successfully! (Demo mode)');
        onSave();
      }
    } catch (error) {
      alert('Error updating user: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        <div className="flex space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Mobile</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">R.Name</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">R.Mobile</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">S.Name</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">S.Mobile #</label>
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

        {/* ID Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">B Number</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">S.ID Number</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">V Number</label>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates and Amount</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
              <input
                type="date"
                name="admission_date"
                className="input-field"
                value={formData.admission_date}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Validity/Expiry Date</label>
              <input
                type="date"
                name="validity_date"
                className="input-field"
                value={formData.validity_date}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="total_amount"
                className="input-field"
                value={formData.total_amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Photo {index + 1}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(index, e.target.files[0])}
                    className="hidden"
                    id={`photo-${index}`}
                  />
                  <label htmlFor={`photo-${index}`} className="cursor-pointer">
                    {photos[index] ? (
                      <div className="space-y-2">
                        <img
                          src={URL.createObjectURL(photos[index])}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-xs text-gray-500">{photos[index].name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <i className="fas fa-camera text-2xl text-gray-400"></i>
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
