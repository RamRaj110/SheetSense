import React, { useState, useEffect } from 'react';
import { FiUpload, FiBarChart2, FiFileText, FiFolder, FiTrash2, FiDownload } from 'react-icons/fi';
import ProfileDropdown from "@/components/ProfileDropdown";
import FileUpload from "@/components/FileUpload"; // Corrected component name
import DataVisualizationView from "@/components/DataVisualizationView";
import { Button } from "@/components/ui/button";
import axios from '../../axios'; // Import your configured axios instance
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";

const SidebarLink = ({ icon, text, active, onClick }) => (
  <a
    href="#"
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200 ${
      active ? 'bg-gray-700 text-white' : ''
    }`}
  >
    {icon}
    <span className="ml-4">{text}</span>
  </a>
);

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('upload');
  const [userFiles, setUserFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const handleFileDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    console.log("Deleting file with ID:", fileId);

    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`/files/${fileId}`);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete file');
      }

      setUserFiles(prev => prev.filter(file => file._id !== fileId));
      if (selectedFile?._id === fileId) {
        setSelectedFile(null);
      }

      setError('File deleted successfully');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/files');
        setUserFiles(response.data.files);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFiles();
    }
  }, [token]);

  const renderContent = () => {
    if (loading && userFiles.length === 0) { // Show loader only on initial load
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
          {error}
        </div>
      );
    }

    switch (activeView) {
      case 'upload':
        return <UploadView onUploadSuccess={(file) => setUserFiles(prev => [...prev, file])} />;
      case 'visualization':
        return <DataVisualizationView files={userFiles} />;
      case 'my-files':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MyFilesView 
                files={userFiles}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFileSelect={setSelectedFile}
                onFileDelete={handleFileDelete}
                selectedFile={selectedFile} 
              />
            </div>
            <div>
              <FileDetailsView file={selectedFile} />
            </div>
          </div>
        );
      default:
        return <UploadView onUploadSuccess={(file) => setUserFiles(prev => [...prev, file])} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold">SheetSense</h2>
        </div>
        <nav className="px-4 mb-2 space-y-2">
          <SidebarLink icon={<FiUpload size={20} />} text="Upload File" active={activeView === 'upload'} onClick={() => setActiveView('upload')} />
          <SidebarLink icon={<FiBarChart2 size={20} />} text="Data Visualization" active={activeView === 'visualization'} onClick={() => setActiveView('visualization')} />
          <SidebarLink icon={<FiFolder size={20} />} text="My Files" active={activeView === 'my-files'} onClick={() => setActiveView('my-files')} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="relative z-10 bg-gray-800/30 backdrop-blur-xl border-b border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">My Dashboard</h1>
            <ProfileDropdown />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const UploadView = ({ onUploadSuccess }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">Upload Your File</h3>
        <FileUpload onUploadSuccess={onUploadSuccess} />
      </div>
    </div>
  );
};

const FileDetailsView = ({ file }) => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      if (!file?._id) {
        setFileData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/files/${file._id}`);
        setFileData(response.data.file);
      } catch (err) {
        setError(err.message);
        setFileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [file?._id]);

  if (!file) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">Select a file to view its details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-8">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-8">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-8">
      <h3 className="text-2xl font-semibold text-white mb-6">File Details</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-gray-400 text-sm">File Name</h4>
            <p className="text-white font-medium">{fileData?.name}</p>
          </div>
          
          <div>
            <h4 className="text-gray-400 text-sm">File Type</h4>
            <p className="text-white font-medium capitalize">{fileData?.type}</p>
          </div>
          
          <div>
            <h4 className="text-gray-400 text-sm">File Size</h4>
            <p className="text-white font-medium">
              {(fileData?.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <div>
            <h4 className="text-gray-400 text-sm">Upload Date</h4>
            <p className="text-white font-medium">
              {new Date(fileData?.uploadDate).toLocaleString()}
            </p>
          </div>
          
          {fileData?.type === 'excel' && (
            <div>
              <h4 className="text-gray-400 text-sm">Row Count</h4>
              <p className="text-white font-medium">{fileData.rowCount} rows</p>
            </div>
          )}
        </div>
      </div>

      {fileData?.type === 'excel' && fileData.data && (
        <div className="mt-8">
          <h4 className="text-gray-400 text-sm mb-4">File Content Preview</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  {Object.keys(fileData.data[0]).map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {fileData.data.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-gray-300">
                        {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const MyFilesView = ({ files, searchQuery, onSearchChange, onFileSelect, onFileDelete, selectedFile }) => {
  const { token } = useSelector((state) => state.auth);
  const filteredFiles = files.filter(file => 
    file && file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (file) => {
    onFileSelect(file === selectedFile ? null : file);
  };

  const handleDownload = async (fileId) => {
    try {
      window.location.href = `${axios.defaults.baseURL}/files/${fileId}/download?token=${token}`;
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">My Files</h2>
          <div className="w-64">
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file, index) => (
              <div 
                key={file._id || index}
                className={`p-4 bg-gray-800 rounded-lg border transition-colors cursor-pointer ${
                  selectedFile?._id === file._id 
                    ? 'border-indigo-500 bg-gray-700' 
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleFileSelect(file)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiFileText className="text-indigo-400" size={20} />
                    <span className="font-medium truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file._id);
                      }}
                    >
                      <FiDownload size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileDelete(file._id);
                      }}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No files found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;