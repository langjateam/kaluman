// server.js
const express = require('express');
const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// POST endpoint to receive sensor data and optional Gemini response
app.post('/endpoint', (req, res) => {
  const sensorData = req.body;
  console.log('Received sensor data:', sensorData);

  // You can add additional processing or saving of sensorData here

  res.status(200).json({ message: 'Data received successfully' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
