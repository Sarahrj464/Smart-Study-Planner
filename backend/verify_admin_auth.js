const mongoose = require('mongoose');

const uri = 'mongodb://admin:admin123@localhost:27017/studyplanner?authSource=admin';

const test = async () => {
    try {
        console.log(`Testing URI: ${uri.replace(/:[^:@]+@/, ':****@')}`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log('✅ Connected successfully!');

        // Try a read command to verify auth role
        const dbs = await mongoose.connection.db.admin().listDatabases();
        console.log('✅ Auth verified! Database list:', dbs.databases.map(d => d.name).join(', '));

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(`❌ Failed: ${err.message}`);
        process.exit(1);
    }
};

test();
