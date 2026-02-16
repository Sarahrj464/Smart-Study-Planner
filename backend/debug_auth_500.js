const mongoose = require('mongoose');
const User = require('./src/models/User');
const { signup } = require('./src/controllers/authController');
const errorHandler = require('./src/middleware/errorHandler');
const dotenv = require('dotenv');
const fs = require('fs');
const util = require('util');

dotenv.config();

const MONGO_URI = 'mongodb://localhost:27017/studyplanner';

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        console.log('--- Attempting Signup Simulation (Duplicate) ---');

        // Simulate request and response objects
        const uniqueEmail = `test_${Date.now()}@gmail.com`;
        const req = {
            body: {
                name: 'Test User',
                email: uniqueEmail,
                password: 'password123'
            }
        };

        const res = {
            status: (code) => {
                console.log(`Response Status: ${code}`);
                return res;
            },
            json: (data) => {
                console.log('Response JSON:', data);
                return res;
            },
            cookie: (name, val, options) => {
                console.log(`Response Cookie: ${name}`);
                return res;
            }
        };

        const next = (err) => {
            const logPath = 'error_log.txt';
            const errorMsg = `Error detected:\n${util.format(err)}\nStack:\n${err.stack}`;
            fs.writeFileSync(logPath, errorMsg);
            console.log(`Error written to ${logPath}`);

            console.log('--- Calling ErrorHandler ---');

            // Mock response for errorHandler
            const mockRes = {
                status: (code) => {
                    console.log(`ErrorHandler Res Status: ${code}`);
                    return mockRes;
                },
                json: (data) => {
                    console.log(`ErrorHandler Res JSON: ${JSON.stringify(data, null, 2)}`);
                    return mockRes;
                }
            };

            errorHandler(err, req, mockRes, () => { });
        };

        await signup(req, res, next);

    } catch (err) {
        console.error('--- UNHANDLED ERROR ---');
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
