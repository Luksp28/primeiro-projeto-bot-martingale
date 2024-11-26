import React from 'react';

function BotControls({ active, onToggle }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Bot Controls</h2>
      
      <button
        onClick={onToggle}
        className={`w-full py-2 px-4 rounded-lg font-semibold ${
          active 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {active ? 'Stop Bot' : 'Start Bot'}
      </button>

      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <h3 className="font-medium mb-2">Settings</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>Symbol: BTCUSDT</p>
          <p>Timeframe: 15m</p>
          <p>Initial Investment: 100 USDT</p>
          <p>Max Martingale Steps: 3</p>
        </div>
      </div>
    </div>
  );
}