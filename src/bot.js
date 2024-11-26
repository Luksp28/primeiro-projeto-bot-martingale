const Binance = require('binance-api-node').default;
require('dotenv').config();

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  testnet: true
});

const SYMBOL = 'BTCUSDT';
const TIMEFRAME = '15m';
const INITIAL_INVESTMENT = 100;
let currentMartingaleStep = 0;
const MAX_MARTINGALE_STEPS = 3;
let isRunning = false;
let lastCandles = [];

async function getCandles() {
  const candles = await client.candles({
    symbol: SYMBOL,
    interval: TIMEFRAME,
    limit: 7
  });
  return candles;
}

function isGreenCandle(candle) {
  return parseFloat(candle.closePrice) > parseFloat(candle.openPrice);
}

function calculateMartingaleAmount(initialAmount, step) {
  return initialAmount * Math.pow(2, step);
}

async function placeSellOrder(amount) {
  try {
    const order = await client.order({
      symbol: SYMBOL,
      side: 'SELL',
      type: 'MARKET',
      quantity: amount
    });
    return order;
  } catch (error) {
    console.error('Error placing sell order:', error);
    return null;
  }
}

async function checkAndTrade(io) {
  try {
    const candles = await getCandles();
    lastCandles = candles;
    
    const last6Candles = candles.slice(0, 6);
    const currentCandle = candles[6];
    const consecutiveGreenCandles = last6Candles.every(candle => isGreenCandle(candle));

    io.emit('updateCandles', candles);

    if (consecutiveGreenCandles && isRunning) {
      const amount = calculateMartingaleAmount(INITIAL_INVESTMENT, currentMartingaleStep);
      const order = await placeSellOrder(amount);

      if (order) {
        io.emit('newTrade', {
          type: 'SELL',
          amount,
          price: currentCandle.closePrice,
          martingaleStep: currentMartingaleStep
        });

        if (!isGreenCandle(currentCandle)) {
          currentMartingaleStep = 0;
          io.emit('tradingStatus', { message: 'Success! Seventh candle is red.' });
        } else {
          if (currentMartingaleStep < MAX_MARTINGALE_STEPS) {
            currentMartingaleStep++;
            io.emit('tradingStatus', { 
              message: `Martingale step ${currentMartingaleStep} activated`
            });
          } else {
            currentMartingaleStep = 0;
            io.emit('tradingStatus', { message: 'Max martingale steps reached' });
          }
        }
      }
    }
  } catch (error) {
    io.emit('error', { message: error.message });
  }
}

function startBot(io) {
  isRunning = true;
  io.emit('botStatus', { running: true });
  
  console.log(`Bot started - ${SYMBOL} ${TIMEFRAME}`);
  
  setInterval(() => checkAndTrade(io), 60000);
  checkAndTrade(io);
}

function stopBot(io) {
  isRunning = false;
  io.emit('botStatus', { running: false });
  console.log('Bot stopped');
}

module.exports = { startBot, stopBot };