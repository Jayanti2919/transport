const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const drivers = {};

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('driverLocationUpdate', (location) => {
    console.log('Location from driver:', location);

    drivers[socket.id] = location;

    io.emit('updateLocation', location);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete drivers[socket.id];
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
