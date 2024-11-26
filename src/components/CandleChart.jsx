import React from 'react';

function CandleChart({ candles }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
      <div className="h-96 flex items-center justify-center">
        {candles.length === 0 ? (
          <p className="text-gray-400">Loading chart data...</p>
        ) : (
          <div className="w-full h-full">
            {/* Simple visualization of candles */}
            <div className="flex h-full items-end space-x-2">
              {candles.map((candle, i) => {
                const isGreen = parseFloat(candle.closePrice) > parseFloat(candle.openPrice);
                const height = `${Math.random() * 100}%`;
                
                return (
                  <div 
                    key={i}
                    className="flex-1"
                    style={{ height }}
                  >
                    <div 
                      className={`w-full h-full ${
                        isGreen ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}