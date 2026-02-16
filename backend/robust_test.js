const http = require('http');

function post(path, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/v1' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    data: resBody ? JSON.parse(resBody) : {}
                });
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function run() {
    console.log('--- Test 1: Signup with short password ---');
    try {
        const res1 = await post('/auth/signup', {
            name: 'Test One',
            email: 'testone@gmail.com',
            password: '123'
        });
        console.log('Status:', res1.status);
        console.log('Data:', JSON.stringify(res1.data, null, 2));
    } catch (e) { console.error(e); }

    console.log('\n--- Test 2: Signup with valid data ---');
    try {
        const res2 = await post('/auth/signup', {
            name: 'Test Two',
            email: 'testtwo' + Date.now() + '@gmail.com',
            password: 'password123'
        });
        console.log('Status:', res2.status);
        console.log('Data:', JSON.stringify(res2.data, null, 2));
    } catch (e) { console.error(e); }

    console.log('\n--- Test 3: Login with invalid credentials ---');
    try {
        const res3 = await post('/auth/login', {
            email: 'nonexistent@gmail.com',
            password: 'wrongpassword'
        });
        console.log('Status:', res3.status);
        console.log('Data:', JSON.stringify(res3.data, null, 2));
    } catch (e) { console.error(e); }
}

run();
