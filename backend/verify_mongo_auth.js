const mongoose = require('mongoose');

const uris = [
    'mongodb://sarahmurtaza2005_db_user:MyPassword2026@localhost:27017/studyplanner?authSource=admin',
    'mongodb://sarahmurtaza2005_db_user:MyPassword2026@localhost:27017/studyplanner',
    'mongodb://localhost:27017/studyplanner'
];

const test = async () => {
    for (const uri of uris) {
        try {
            console.log(`Testing URI: ${uri.replace(/:[^:@]+@/, ':****@')}`);
            const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
            console.log('✅ Connected successfully!');
            await mongoose.connection.db.admin().listDatabases();
            console.log('✅ Auth verified!');
            await mongoose.disconnect();
            process.exit(0);
        } catch (err) {
            console.error(`❌ Failed: ${err.message}`);
        }
    }
    process.exit(1);
};

test();
