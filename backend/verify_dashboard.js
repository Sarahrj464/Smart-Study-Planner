const http = require('http');

const uniqueEmail = `perf_test_${Date.now()}@gmail.com`;
const authData = JSON.stringify({
    name: 'Perf Test User',
    email: uniqueEmail,
    password: 'password123'
});

const authOptions = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/v1/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': authData.length
    }
};

const makeRequest = (options, data) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
};

const run = async () => {
    try {
        console.log(`1. Signing up new user (${uniqueEmail})...`);
        const authRes = await makeRequest(authOptions, authData);

        if (!authRes.body.success) {
            console.error('Signup failed:', authRes.body);
            return;
        }

        const token = authRes.body.token;
        console.log('Signup successful. Token acquired.');

        console.log('2. Fetching Dashboard Stats...');
        const dashboardOptions = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/v1/dashboard',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const start = performance.now();
        const dashRes = await makeRequest(dashboardOptions);
        const end = performance.now();
        const duration = (end - start).toFixed(2);

        console.log(`Status: ${dashRes.statusCode}`);
        console.log(`Time: ${duration} ms`);

        if (dashRes.body.success) {
            console.log('✅ Dashboard Data fetched successfully');
            const keys = Object.keys(dashRes.body.data);
            console.log('Data keys:', keys.join(', '));

            if (duration < 2000) {
                console.log('✅ Performance PASS (< 2000ms)');
            } else {
                console.log('❌ Performance FAIL (> 2000ms)');
            }
        } else {
            console.error('❌ Failed to fetch dashboard data:', dashRes.body);
        }

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
