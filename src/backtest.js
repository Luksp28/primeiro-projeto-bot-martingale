const { getHistoricalData, runSimulation } = require('./simulation');
const INITIAL_BALANCE = 100;
const ENTRY_SIZE = 2;

async function startBacktest() {
  const endTime = new Date();
  const startTime = new Date(endTime - (2 * 60 * 60 * 1000)); // 2 hours ago
  
  try {
    const historicalData = await getHistoricalData('BTCUSDT', '15m', startTime, endTime);
    const results = runSimulation(historicalData, INITIAL_BALANCE, ENTRY_SIZE);
    
    console.log('\n=== Simulation Results ===');
    console.log(`Initial Balance: $${INITIAL_BALANCE}`);
    console.log(`Final Balance: $${results.finalBalance.toFixed(2)}`);
    console.log(`Total Trades: ${results.totalTrades}`);
    console.log(`Winning Trades: ${results.winningTrades}`);
    console.log(`Losing Trades: ${results.losingTrades}`);
    console.log(`Profit/Loss: $${(results.finalBalance - INITIAL_BALANCE).toFixed(2)}`);
    console.log(`Win Rate: ${((results.winningTrades / results.totalTrades) * 100).toFixed(2)}%`);
    
    return results;
  } catch (error) {
    console.error('Simulation failed:', error);
  }
}

startBacktest();