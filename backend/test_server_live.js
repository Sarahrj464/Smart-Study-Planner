const http = require('http');

const data = JSON.stringify({
    name: 'Sarah',
    email: 'sarahmurtaza2005@gmail.com',
    password: 'password123'
});

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/v1/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(data);
req.end();

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);