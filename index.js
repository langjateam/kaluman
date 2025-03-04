// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Middleware to parse JSON payloads
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static('public'));

// POST endpoint to receive sensor data and recommended crops
app.post('/endpoint', (req, res) => {
  const sensorData = req.body;

  // If there is a geminiResponse field, rename it to recommendedCrops
  if (sensorData.geminiResponse) {
    sensorData.recommendedCrops = sensorData.geminiResponse;
    delete sensorData.geminiResponse;
  }

  console.log('Received sensor data with recommended crops:', sensorData);

  // Immediately push data to the dashboard via Socket.IO
  io.emit('newData', sensorData);

  res.status(200).json({ message: 'Data received and pushed to dashboard successfully with recommended crops' });
});

// Log when a new client connects
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
});

// Start the server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
