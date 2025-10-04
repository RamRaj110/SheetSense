import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChartDisplay from './ChartDisplay';

const DataVisualizationView = ({ files }) => {
  const [selectedFileId, setSelectedFileId] = useState('');
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Helper function to get numeric columns from data
  const getNumericColumns = (data) => {
    if (!data || !data[0]) return [];
    return Object.entries(data[0])
      .filter(([_, value]) => !isNaN(value) && typeof value !== 'boolean')
      .map(([key]) => key);
  };

  useEffect(() => {
    const fetchFileData = async () => {
      if (!selectedFileId) {
        setFileData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/files/${selectedFileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch file data');
        }

        if (!data.file?.data || !Array.isArray(data.file.data)) {
          throw new Error('Invalid data format received from server');
        }

        if (data.file.data.length === 0) {
          throw new Error('File contains no data');
        }

        // Validate that we have at least one numeric column
        const numericColumns = getNumericColumns(data.file.data);
        if (numericColumns.length === 0) {
          throw new Error('No numeric data found in the file to visualize');
        }

        setFileData(data.file.data);
      } catch (err) {
        console.error('Error fetching file data:', err);
        setError(err.message);
        setFileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [selectedFileId, token]);

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-lg p-8">
      <h3 className="text-2xl font-semibold text-white mb-6">Data Visualization</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select File to Visualize
        </label>
        <select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
        >
          <option value="">Choose a file</option>
          {files.filter(f => f.type === 'excel').map((file) => (
            <option key={file.id} value={file.id}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-center">
          {error.message}
        </div>
      )}

      {fileData && !loading && !error && (
        <div className="space-y-8">
          {getNumericColumns(fileData).map(column => (
            <div key={column} className="bg-gray-800/50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">{column} Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-md text-gray-300 mb-3">Bar Chart</h5>
                  <ChartDisplay 
                    data={fileData} 
                    type="bar"
                    column={column}
                  />
                </div>
                <div>
                  <h5 className="text-md text-gray-300 mb-3">Line Chart</h5>
                  <ChartDisplay 
                    data={fileData} 
                    type="line"
                    column={column}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-8">
            <h4 className="text-lg font-medium text-white mb-4">Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    {Object.keys(fileData[0]).map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {fileData.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((cell, j) => {
                        console.log("Cell value:", cell);
                        return (
                          <td key={j} className="px-4 py-3 text-sm text-gray-300">
                            {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !fileData && (
        <p className="text-gray-400 text-center py-8">
          Select an Excel file to visualize its data
        </p>
      )}
    </div>
  );
};

export default DataVisualizationView;
