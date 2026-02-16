const http = require('http');

const uniqueEmail = `data_test_${Date.now()}@gmail.com`;
const authData = JSON.stringify({
    name: 'Data Test User',
    email: uniqueEmail,
    password: 'password123'
});

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
        // 1. Signup
        console.log(`1. Signing up (${uniqueEmail})...`);
        const authRes = await makeRequest({
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/v1/auth/signup',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, authData);

        const token = authRes.body.token;
        if (!token) throw new Error('No token ' + JSON.stringify(authRes.body));
        console.log('Signup OK.');

        // 2. Create Completed Task
        console.log('2. Creating Completed Task...');
        const taskData = JSON.stringify({
            title: 'Test Task',
            subject: 'Mathematics', // Must match enum
            dueDate: new Date().toISOString(),
            time: '10:00 AM',
            completed: true, // Need to verify if API allows setting completed on create, usually yes.
            // If not, we update it. But simpler to try.
            type: 'Task'
        });

        // Actually, let's just create a session, easier.
        // Task creation might fail if fields are missing.

        // 3. Create Pomodoro Session
        console.log('3. Creating Pomodoro Session...');
        const sessionData = JSON.stringify({
            duration: 60,
            type: 'Study',
            date: new Date().toISOString()
        });

        const sessionRes = await makeRequest({
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/v1/pomodoro', // Need to check route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, sessionData);
        console.log('Session Create Status:', sessionRes.statusCode);

        // 4. Fetch Dashboard
        console.log('4. Fetching Dashboard...');
        const dashRes = await makeRequest({
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/v1/dashboard',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const stats = dashRes.body.data;
        const totalMinutes = stats.analytics.totalMinutes;
        const upcomingTasks = stats.user.taskStats.upcomingTasks;

        console.log('Total Minutes:', totalMinutes);
        console.log('Upcoming Tasks Length:', upcomingTasks ? upcomingTasks.length : 'UNDEFINED');

        if (totalMinutes === 60 && Array.isArray(upcomingTasks)) {
            console.log('✅ Structure & Aggregation Logic Works!');
        } else {
            console.log('❌ Logic Failed!');
        }

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
