const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// Load env from current directory or backend directory
const envPath = fs.existsSync('.env') ? '.env' : path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const mongoose = require('mongoose');
const User = require('./src/models/User');
const { login } = require('./src/controllers/authController');

// Mock response object
const res = {
    statusCode: 200,
    headers: {},
    status: function (code) {
        this.statusCode = code;
        console.log(`\n⬇️ RESPONSE STATUS: ${code}`);
        return this;
    },
    cookie: function (name, val, options) {
        console.log(`🍪 COOKIE SET: ${name}`);
        return this;
    },
    json: function (data) {
        console.log('⬇️ RESPONSE JSON:', JSON.stringify(data, null, 2));
        return this;
    },
    send: function (body) {
        console.log('⬇️ RESPONSE SEND:', body);
        return this;
    }
};

const testLogin = async () => {
    try {
        console.log('--- TEST LOGIN START ---');
        console.log(`URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@') : 'UNDEFINED'}`);

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB!');

        const req = {
            body: {
                email: 'sarahmurtaza2005@gmail.com',
                password: 'password123'
            }
        };

        const next = (err) => {
            if (err) {
                console.error('\n❌ NEXT called with ERROR:', err);
                if (err.stack) console.error(err.stack);
            } else {
                console.log('\n⚠️ NEXT called without error (usually means middleware pass)');
            }
        };

        console.log('🚀 Executing login controller...');
        await login(req, res, next);

        // Give time for async ops and logs
        setTimeout(() => {
            console.log('--- TEST FINISHED [Force Exit] ---');
            process.exit(0);
        }, 1000);

    } catch (err) {
        console.error('\n🔥 SCRIPT CRASHED:', err);
        process.exit(1);
    }
};

testLogin();
