import React from 'react';

function TradeHistory({ trades }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Trade History</h2>
      
      {trades.length === 0 ? (
        <p className="text-gray-400">No trades yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="p-2">Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Price</th>
                <th className="p-2">Martingale Step</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="p-2">
                    <span className={`text-${trade.type === 'SELL' ? 'red' : 'green'}-500`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="p-2">{trade.amount}</td>
                  <td className="p-2">{trade.price}</td>
                  <td className="p-2">{trade.martingaleStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}