# Crypto Trading Bot

This bot trades cryptocurrency futures on Binance with the following strategy:
- Monitors 15-minute candles
- Enters a sell position after 6 consecutive green candles
- Uses martingale strategy if the seventh candle is green
- Calculates position sizes to ensure profit on successful trades

## Setup

1. Create a Binance account and generate API keys
2. Copy your API keys to the .env file
3. Install dependencies: `npm install`
4. Start the bot: `npm start`

## Configuration

- Edit INITIAL_INVESTMENT in bot.js to set your base position size
- MAX_MARTINGALE_STEPS controls maximum number of martingale iterations
- Set testnet to false in bot.js for real trading

## Warning

Trading cryptocurrencies involves significant risk. Use this bot at your own risk and always start with small amounts in testnet first.