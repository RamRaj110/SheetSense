import React, { useState, useEffect } from 'react';
import { FiUsers, FiFile, FiPieChart, FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import ProfileDropdown from "@/components/ProfileDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from '../../axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalAnalytics: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/stats')
      ]);
      
      // The users are directly in the response data
      const usersList = Array.isArray(usersResponse.data) ? usersResponse.data : [];
      setUsers(usersList);
      
      setStats({
        totalUsers: usersList.length,
        totalFiles: statsResponse.data.totalFiles || 0,
        totalAnalytics: statsResponse.data.totalAnalytics || 0
      });
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`/admin/users/${userId}/details`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      alert('Failed to fetch user details. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    (user?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const StatCard = ({ icon, title, value, colorClass }) => (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-lg p-6 transition-all duration-200 hover:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
          <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text', 'bg')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Navbar */}
      <nav className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
            <ProfileDropdown />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FiUsers size={24} className="text-blue-400" />}
            title="Total Users"
            value={stats.totalUsers}
            colorClass="text-blue-400"
          />
          <StatCard
            icon={<FiFile size={24} className="text-green-400" />}
            title="Total Files"
            value={stats.totalFiles}
            colorClass="text-green-400"
          />
          <StatCard
            icon={<FiPieChart size={24} className="text-purple-400" />}
            title="Analytics Generated"
            value={stats.totalAnalytics}
            colorClass="text-purple-400"
          />
        </div>

        {/* Users Management Section */}
        <div className="space-y-6">
          {/* Users List */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Users Management</h2>
              <div className="w-64">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  icon={<FiSearch className="text-gray-400" />}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Files</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                          {user.filesCount || 0} files
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-400 hover:text-indigo-300"
                          onClick={() => handleViewUser(user._id)}
                        >
                          <FiEye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <FiTrash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  {searchQuery ? 'No users match your search' : 'No users found'}
                </div>
              )}
            </div>
          </div>

          {/* User Details Section */}
          {selectedUser && (
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">User Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm">Name</h4>
                    <p className="text-white font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Email</h4>
                    <p className="text-white font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Joined Date</h4>
                    <p className="text-white font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm">Total Files</h4>
                    <p className="text-white font-medium">{selectedUser.filesCount || 0}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Storage Used</h4>
                    <p className="text-white font-medium">
                      {((selectedUser.storageUsed || 0) / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Last Active</h4>
                    <p className="text-white font-medium">
                      {selectedUser.lastActive
                        ? new Date(selectedUser.lastActive).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedUser.recentFiles && selectedUser.recentFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Recent Files</h3>
                  <div className="space-y-2">
                    {selectedUser.recentFiles.map((file) => (
                      <div
                        key={file._id}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FiFile className="text-gray-400" />
                          <div>
                            <p className="text-sm text-white font-medium">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              {(file.fileSize / 1024 / 1024).toFixed(2)} MB •{' '}
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={async () => {
                            try {
                              await axios.delete(`/admin/files/${file._id}`);
                              const updatedUser = {
                                ...selectedUser,
                                recentFiles: selectedUser.recentFiles.filter(f => f._id !== file._id),
                                filesCount: (selectedUser.filesCount || 0) - 1
                              };
                              setSelectedUser(updatedUser);
                              setStats(prev => ({ ...prev, totalFiles: prev.totalFiles - 1 }));
                            } catch (error) {
                              console.error('Failed to delete file:', error);
                              alert('Failed to delete file. Please try again.');
                            }
                          }}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
