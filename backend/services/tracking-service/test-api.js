import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

// Test functions
async function testAPI() {
  try {
    console.log("\n Starting Tracking Service API Tests...\n");

    // Test 1: Health Check
    console.log(" Testing Health Check...");
    const healthRes = await axios.get("http://localhost:5000/health");
    console.log(" Health Check:", healthRes.data);

    // Test 2: Welcome Endpoint
    console.log("\n Testing Welcome Endpoint...");
    const welcomeRes = await axios.get("http://localhost:5000/");
    console.log(" Welcome:", welcomeRes.data);

    // Test 3: Update Location
    console.log("\n Testing Location Update...");
    const locationData = {
      busId: "507f1f77bcf86cd799439011", // Sample MongoDB ObjectId
      lat: 28.7041,
      lng: 77.1025,
      speed: 55,
    };
    const updateRes = await axiosInstance.post("/location/update", locationData);
    console.log(" Location Updated:", updateRes.data);

    // Test 4: Get Latest Location
    if (updateRes.data.success) {
      console.log("\n Testing Get Latest Location...");
      const busId = updateRes.data.location.busId;
      const getRes = await axiosInstance.get(`/location/latest/${busId}`);
      console.log(" Latest Location Retrieved:", getRes.data);
    }

    // Test 5: 404 Error Handling
    console.log("\n Testing Error Handling (Invalid Route)...");
    try {
      await axios.get("http://localhost:5000/invalid-route");
    } catch (error) {
      console.log(" 404 Error Handled:", error.response.data);
    }

    console.log("\n All tests completed!");
  } catch (error) {
    console.error("❌ Test Error:", error.response?.data || error.message);
  }
}

testAPI();
