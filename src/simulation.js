const Binance = require('binance-api-node').default;
require('dotenv').config();

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET
});

async function getHistoricalData(symbol, interval, startTime, endTime) {
  try {
    const candles = await client.candles({
      symbol: symbol,
      interval: interval,
      startTime: startTime.getTime(),
      endTime: endTime.getTime()
    });
    return candles;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

function isGreenCandle(candle) {
  return parseFloat(candle.close) > parseFloat(candle.open);
}

function calculateMartingaleSize(baseSize, step) {
  return baseSize * Math.pow(2, step);
}

function runSimulation(candles, initialBalance, baseEntrySize) {
  let balance = initialBalance;
  let currentMartingaleStep = 0;
  let totalTrades = 0;
  let winningTrades = 0;
  let losingTrades = 0;

  // We need at least 7 candles to make a decision
  for (let i = 6; i < candles.length; i++) {
    // Check previous 6 candles
    const last6Candles = candles.slice(i - 6, i);
    const currentCandle = candles[i];
    
    // Check if we have 6 consecutive green candles
    const consecutiveGreenCandles = last6Candles.every(candle => isGreenCandle(candle));
    
    if (consecutiveGreenCandles) {
      totalTrades++;
      const entryPrice = parseFloat(currentCandle.open);
      const exitPrice = parseFloat(currentCandle.close);
      const positionSize = calculateMartingaleSize(baseEntrySize, currentMartingaleStep);
      
      // Calculate profit/loss
      const priceDifference = entryPrice - exitPrice; // For short positions
      const profitLoss = (priceDifference / entryPrice) * positionSize;
      
      balance += profitLoss;
      
      if (profitLoss > 0) {
        winningTrades++;
        currentMartingaleStep = 0; // Reset martingale on win
        console.log(`Win: +$${profitLoss.toFixed(2)} | Balance: $${balance.toFixed(2)}`);
      } else {
        losingTrades++;
        if (currentMartingaleStep < 3) { // Max 3 martingale steps
          currentMartingaleStep++;
        } else {
          currentMartingaleStep = 0; // Reset after max steps
        }
        console.log(`Loss: ${profitLoss.toFixed(2)} | Balance: $${balance.toFixed(2)} | Martingale Step: ${currentMartingaleStep}`);
      }
    }
  }

  return {
    finalBalance: balance,
    totalTrades,
    winningTrades,
    losingTrades
  };
}

module.exports = {
  getHistoricalData,
  runSimulation
};