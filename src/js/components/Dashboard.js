import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAmount: 0,
    totalReceived: 0,
    recentPayments: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        const data = await ipcRenderer.invoke('get-dashboard-stats');
        setStats(data);
      } else {
        // Fallback for testing - show demo data
        setStats({
          totalUsers: 25,
          totalAmount: 125000,
          totalReceived: 87500,
          recentPayments: [
            { id: 1, user_name: 'John Doe', amount: 5000, date: '2024-01-15' },
            { id: 2, user_name: 'Jane Smith', amount: 3000, date: '2024-01-14' },
            { id: 3, user_name: 'Mike Johnson', amount: 7500, date: '2024-01-13' }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Set demo data on error
      setStats({
        totalUsers: 25,
        totalAmount: 125000,
        totalReceived: 87500,
        recentPayments: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button 
          onClick={loadDashboardStats}
          className="btn-primary"
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <i className="fas fa-users text-2xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <i className="fas fa-dollar-sign text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <i className="fas fa-hand-holding-usd text-2xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Received</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalReceived)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Received Amount</span>
            <span>{formatCurrency(stats.totalReceived)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: stats.totalAmount > 0 ? `${(stats.totalReceived / stats.totalAmount) * 100}%` : '0%' 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Amount</span>
            <span>{formatCurrency(stats.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
        {stats.recentPayments.length > 0 ? (
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
                    User ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{payment.user_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No recent payments</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
