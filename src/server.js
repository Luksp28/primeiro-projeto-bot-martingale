const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { startBot } = require('./bot');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('toggleBot', (active) => {
    if (active) {
      startBot(io);
    }
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});