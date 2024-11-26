import React from 'react';

function StatusPanel({ status }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Status</h2>
      <div className="p-3 bg-gray-700 rounded-lg">
        <p className="text-gray-300">{status || 'Waiting for signals...'}</p>
      </div>
    </div>
  );
}