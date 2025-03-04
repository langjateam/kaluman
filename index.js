// server.js
const express = require('express');
const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// POST endpoint to receive sensor data and recommended crops
app.post('/endpoint', (req, res) => {
  const sensorData = req.body;

  // If there is a geminiResponse field, rename it to recommendedCrops
  if (sensorData.geminiResponse) {
    sensorData.recommendedCrops = sensorData.geminiResponse;
    delete sensorData.geminiResponse;
  }

  console.log('Received sensor data with recommended crops:', sensorData);

  // You can add additional processing or saving of sensorData here

  res.status(200).json({ message: 'Data received successfully with recommended crops' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
