const axios = require("axios");

const API = "http://localhost:5000/api/auth";

function dumpError(err) {
  if (err.response) {
    console.error("HTTP status:", err.response.status);
    console.error("Response body:", err.response.data);
  } else if (err.request) {
    console.error("No response received. Request:", err.request);
  } else {
    console.error("Error message:", err.message);
  }

  if (typeof err.toJSON === "function") {
    console.error("Axios error JSON:", err.toJSON());
  } else {
    console.error("Error object:", err);
  }
}

async function main() {
  console.log("Testing auth role flow against", API);

  try {
    const registerRes = await axios.post(`${API}/register`, {
      name: "Student Test",
      email: "student@test.com",
      password: "Test12345!",
      role: "user"
    });

    console.log("Register success:", registerRes.data);
  } catch (err) {
    console.error("Register failed:");
    dumpError(err);
  }

  try {
    const loginRes = await axios.post(`${API}/login`, {
      email: "student@test.com",
      password: "Test12345!"
    });

    console.log("Login success:", loginRes.data);
    console.log("Role returned from login:", loginRes.data.role);

    const token = loginRes.data.token;

    const profileRes = await axios.get(`${API}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Profile success:", profileRes.data);
    console.log("Role from profile user:", profileRes.data.role);
  } catch (err) {
    console.error("Login/profile test failed:");
    dumpError(err);
  }
}

main();