// app.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const axios = require('axios');
const cors = require('cors');

// Use CORS middleware for Express routes
app.use(express.json());
app.use(cors());

// Initialize Socket.IO with CORS configuration
const io = require('socket.io')(http, {
  cors: {
    origin: "http://aift.techloom.tech", // Allow only your client origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

// (Optional) Serve static files for your dashboard (if any)
app.use(express.static('public'));

// POST endpoint to receive sensor data
app.post('/endpoint', (req, res) => {
  let data = req.body;
  
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
  
  // Once the server is running, start sending sensor data
  setInterval(sendSensorData, 5000);
});

// --- Sensor Client Code --- //

// Function to generate dummy sensor data
function getRandomSensorData() {
  // Generate random values within a realistic range
  const temperature = (20 + Math.random() * 10).toFixed(2); // 20°C - 30°C
  const humidity = (40 + Math.random() * 20).toFixed(2);     // 40% - 60%
  const pH = (6.0 + Math.random() * 2.0).toFixed(2);         // pH 6.0 - 8.0
  const moisture = (30 + Math.random() * 40).toFixed(2);       // 30% - 70%
  // Dummy geminiResponse which will be renamed to recommendedCrops by the server
  const geminiResponse = "Wheat, Rice";

  return {
    temperature,
    humidity,
    pH,
    moisture,
    geminiResponse
  };
}

// Function to send sensor data to the /endpoint
function sendSensorData() {
  const data = getRandomSensorData();
  console.log("Sending sensor data:", data);

  axios.post(`http://localhost:${PORT}/endpoint`, data)
    .then((response) => {
      console.log("Response from server:", response.data);
    })
    .catch((error) => {
      console.error("Error sending sensor data:", error.message);
    });
}
