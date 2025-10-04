import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">🚫 Unauthorized</h1>
      <p className="mb-6">You don't have permission to access this page.</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Go Home
      </Link>
    </div>
  );
}

export default Unauthorized;
