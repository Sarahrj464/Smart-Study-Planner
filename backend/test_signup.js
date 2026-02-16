const axios = require('axios');

async function testSignup() {
    const url = 'http://localhost:5000/api/v1/auth/signup';
    const payload = {
        name: 'Sarah Fashion',
        email: 'sarahfashion@gmail.com',
        password: 'pass' // Too short, should trigger 400 validation error
    };

    try {
        console.log('--- Testing Signup with invalid data (short password) ---');
        await axios.post(url, payload);
    } catch (err) {
        console.log('Status:', err.response?.status);
        console.log('Data:', JSON.stringify(err.response?.data, null, 2));
    }

    try {
        console.log('\n--- Testing Signup with valid data ---');
        payload.password = 'sarahpassword123';
        const res = await axios.post(url, payload);
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.log('Status:', err.response?.status);
        console.log('Data:', JSON.stringify(err.response?.data, null, 2));
    }
}
testSignup();
