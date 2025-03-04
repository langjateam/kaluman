// sensorClient.js
const axios = require('axios');

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

// Function to send sensor data to the endpoint
function sendSensorData() {
  const data = getRandomSensorData();
  console.log("Sending sensor data:", data);

  axios.post('http://localhost:3000/endpoint', data)
    .then((response) => {
      console.log("Response from server:", response.data);
    })
    .catch((error) => {
      console.error("Error sending sensor data:", error.message);
    });
}

// Send sensor data every 10 seconds
setInterval(sendSensorData, 5000);
