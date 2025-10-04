import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

function UploadForm({ onUploadSuccess }) {
  const { token } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/pdf",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError(
        "Please upload only Excel (.xlsx), CSV (.csv), or PDF (.pdf) files"
      );
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size should not exceed 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      onUploadSuccess?.(result.fileInfo);
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      setError({ type: 'success', message: 'File uploaded successfully' });
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-4">
        {error && (
          <div className={`text-sm p-3 rounded border ${
            error.type === 'success' 
              ? 'bg-green-900/20 border-green-800 text-green-400' 
              : 'bg-red-900/20 border-red-800 text-red-400'
          }`}>
            {typeof error === 'object' ? error.message : error}
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="file"
            accept=".xlsx,.csv,.pdf"
            onChange={handleFileChange}
            className="border rounded p-2 mr-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !file}
            className="min-w-[120px]"
          >
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadForm;
