import React, { useState, useEffect } from 'react';
import EditUser from './EditUser';
import PhotoViewer from './PhotoViewer';

function UserDetail({ userId, onBack }) {
  const [userData, setUserData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserData();
    loadUserPhotos();
  }, [userId]);

  const loadUserData = async () => {
    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        const data = await ipcRenderer.invoke('get-user', userId);
        if (data) {
          setUserData(data.user);
          setPayments(data.payments);
        }
      } else {
        // Fallback for testing - show demo data
        setUserData({
          id: userId,
          name: 'John Doe',
          mobile: '+1234567890',
          father_name: 'Mike Doe',
          father_mobile: '+1234567891',
          relative_name: 'Sarah Doe',
          relative_mobile: '+1234567892',
          spouse_name: 'Jane Doe',
          spouse_mobile: '+1234567893',
          id_number: 'ID001',
          b_number: 'B001',
          s_id_number: 'S001',
          v_number: 'V001',
          admission_date: '2024-01-01',
          validity_date: '2024-12-31',
          total_amount: 50000,
          photos: []
        });
        setPayments([
          { id: 1, amount: 10000, payment_date: '2024-01-15', created_at: '2024-01-15' },
          { id: 2, amount: 15000, payment_date: '2024-02-01', created_at: '2024-02-01' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPhotos = async () => {
    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke('get-user-photos', userId);
        if (result.success) {
          setUserPhotos(result.photos);
        }
      } else {
        // Fallback for testing - show demo photos
        setUserPhotos([]);
      }
    } catch (error) {
      console.error('Failed to load user photos:', error);
      setUserPhotos([]);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentForm.amount || !paymentForm.paymentDate) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke('add-payment', {
          userId: userId,
          amount: parseFloat(paymentForm.amount),
          paymentDate: paymentForm.paymentDate
        });
        
        if (result.success) {
          alert('Payment added successfully!');
          setPaymentForm({
            amount: '',
            paymentDate: new Date().toISOString().split('T')[0]
          });
          setShowPaymentForm(false);
          loadUserData(); // Reload to show new payment
        } else {
          alert('Failed to add payment: ' + result.message);
        }
      } else {
        // Fallback for testing
        alert('Payment added successfully! (Demo mode)');
        setPaymentForm({
          amount: '',
          paymentDate: new Date().toISOString().split('T')[0]
        });
        setShowPaymentForm(false);
        loadUserData(); // Reload to show new payment
      }
    } catch (error) {
      alert('Error adding payment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  const totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = (userData?.total_amount || 0) - totalReceived;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-user-slash text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-500">User not found</p>
        <button onClick={onBack} className="btn-primary mt-4">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="btn-secondary">
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowEditForm(!showEditForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-edit mr-2"></i>
            Edit User
          </button>
          <button 
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="btn-success"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Payment
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <EditUser 
          userData={userData}
          onSave={() => {
            setShowEditForm(false);
            loadUserData(); // Reload user data after edit
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {/* Payment Form */}
      {showPaymentForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment</h3>
          <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="input-field"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                className="input-field"
                value={paymentForm.paymentDate}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Payment'}
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(userData.total_amount || 0)}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Received</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceived)}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Remaining</p>
            <p className={`text-2xl font-bold ${remainingAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(remainingAmount)}
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Payment Count</p>
            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="text-sm text-gray-900">{userData.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Mobile</label>
              <p className="text-sm text-gray-900">{userData.mobile}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Father's Name</label>
              <p className="text-sm text-gray-900">{userData.father_name || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Father's Mobile</label>
              <p className="text-sm text-gray-900">{userData.father_mobile || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">R.Name</label>
              <p className="text-sm text-gray-900">{userData.relative_name || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">R.Mobile</label>
              <p className="text-sm text-gray-900">{userData.relative_mobile || '-'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Spouse's Name</label>
              <p className="text-sm text-gray-900">{userData.spouse_name || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">S.Mobile #</label>
              <p className="text-sm text-gray-900">{userData.spouse_mobile || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">ID Number</label>
              <p className="text-sm text-gray-900">{userData.id_number || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">B Number</label>
              <p className="text-sm text-gray-900">{userData.b_number || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">S.ID Number</label>
              <p className="text-sm text-gray-900">{userData.s_id_number || '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">V Number</label>
              <p className="text-sm text-gray-900">{userData.v_number || '-'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Admission Date</label>
              <p className="text-sm text-gray-900">
                {userData.admission_date ? new Date(userData.admission_date).toLocaleDateString() : '-'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Validity/Expiry Date</label>
              <p className="text-sm text-gray-900">
                {userData.validity_date ? new Date(userData.validity_date).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((index) => {
            const photo = userPhotos.find(p => p.photo_order === index + 1);
            return (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-500">
                  Photo {index + 1}
                </label>
                <div className="border-2 border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                  {photo ? (
                    <div className="space-y-2">
                      <img
                        src={`file://${photo.photo_path}`}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          const photoIndex = userPhotos.findIndex(p => p.id === photo.id);
                          setCurrentPhotoIndex(photoIndex);
                          setShowPhotoViewer(true);
                        }}
                      />
                      <p className="text-xs text-gray-500">Click to view</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <i className="fas fa-image text-2xl text-gray-400"></i>
                      <p className="text-xs text-gray-500">No photo</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {showPhotoViewer && userPhotos.length > 0 && (
        <PhotoViewer
          photos={userPhotos}
          currentIndex={currentPhotoIndex}
          onClose={() => setShowPhotoViewer(false)}
          onNavigate={setCurrentPhotoIndex}
        />
      )}

      {/* Payment History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-receipt text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No payments recorded yet</p>
            <p className="text-sm text-gray-400">Add the first payment using the button above</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
