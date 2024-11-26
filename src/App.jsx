import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import CandleChart from './components/CandleChart';
import TradeHistory from './components/TradeHistory';
import BotControls from './components/BotControls';
import StatusPanel from './components/StatusPanel';

const socket = io('http://localhost:3000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [botActive, setBotActive] = useState(false);
  const [candles, setCandles] = useState([]);
  const [trades, setTrades] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('updateCandles', (newCandles) => setCandles(newCandles));
    socket.on('newTrade', (trade) => setTrades(prev => [...prev, trade]));
    socket.on('tradingStatus', ({ message }) => setStatus(message));
    socket.on('botStatus', ({ running }) => setBotActive(running));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('updateCandles');
      socket.off('newTrade');
      socket.off('tradingStatus');
      socket.off('botStatus');
    };
  }, []);

  const toggleBot = () => {
    socket.emit('toggleBot', !botActive);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Crypto Trading Bot</h1>
          <p className="text-gray-400">
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CandleChart candles={candles} />
          </div>
          
          <div className="space-y-6">
            <BotControls 
              active={botActive} 
              onToggle={toggleBot} 
            />
            <StatusPanel status={status} />
          </div>
        </div>

        <div className="mt-6">
          <TradeHistory trades={trades} />
        </div>
      </div>
    </div>
  );
}