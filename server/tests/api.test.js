const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Test root endpoint
    console.log('1. Testing root endpoint (/):');
    const rootResponse = await axios.get(API_URL);
    console.log('Success:', rootResponse.data);

    // Test /api endpoint
    console.log('\n2. Testing /api endpoint:');
    const apiResponse = await axios.get(`${API_URL}/api`);
    console.log('Success:', apiResponse.data);

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

testAPI(); 