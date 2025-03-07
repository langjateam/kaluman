// app.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

// Use CORS middleware for Express routes
app.use(express.json());
app.use(cors());

// Initialize Socket.IO with CORS configuration
const io = require('socket.io')(http, {
  cors: {
    origin: "*", // Allows any origin; adjust as needed for production security
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Serve static files for your dashboard (if any)
app.use(express.static('public'));

// POST endpoint to receive sensor data
app.post('/endpoint', (req, res) => {
  const data = req.body;
  
  // Rename geminiResponse to recommendedCrops if present
  if (data.geminiResponse) {
    data.recommendedCrops = data.geminiResponse;
    delete data.geminiResponse;
  }
  
  console.log("Received sensor data:", data);
  
  // Emit the sensor data to all connected Socket.IO clients
  io.emit('newData', data);
  
  // Respond with a success status and the data received
  res.json({ status: 'success', data });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server on a designated port
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
