const axios = require('axios');

const API_URL = process.env.BASEURL || 'http://localhost:5000'; // Use BASEURL from .env

const tests = {
  async testRoot() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async testAPI() {
    const response = await axios.get(`${API_URL}/api`);
    return response.data;
  },

  async testValues() {
    const response = await axios.get(`${API_URL}/api`);
    return response.data.values;
  },

  async testProducts() {
    const response = await axios.get(`${API_URL}/api`);
    return response.data.products;
  }
};

async function runTests() {
  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      console.log(`\nRunning ${testName}...`);
      const result = await testFn();
      console.log('Success:', result);
    } catch (error) {
      console.error(`${testName} failed:`, error.message);
    }
  }
}

runTests(); 