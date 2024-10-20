const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// HTTP server and Socket.io server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('driverLocationUpdate', (locationData) => {
    console.log('Driver location received:', locationData);
    // Broadcast the location to all connected customers
    io.emit('broadcastDriverLocation', locationData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
