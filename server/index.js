const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const proxyServer = require('./proxy/proxy_server');
const Trip = require('./models/trip.model');
const Customer = require('./models/customer.model');
const Driver = require('./models/driver.model');
const Admin = require('./models/admin.model');
const connect = require('./utils/mongoConnection');
const driverAuthAPI = require('./auth/driverAuth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/proxy', proxyServer);
app.use('/driver', driverAuthAPI);

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
    io.emit('broadcastDriverLocation', locationData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connect();
});
