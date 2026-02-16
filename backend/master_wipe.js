const mongoose = require('mongoose');

// Define connection string - using the one verified in previous steps
const MONGO_URI = 'mongodb://admin:admin123@mongodb:27017/studyplanner?authSource=admin';

const wipeDatabase = async () => {
    try {
        console.log('🚀 Starting Master Wipe...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB.');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📦 Found ${collections.length} collections.`);

        for (const col of collections) {
            console.log(`🧹 Clearing collection: ${col.name}...`);
            await mongoose.connection.db.collection(col.name).deleteMany({});
            console.log(`✅ ${col.name} cleared.`);
        }

        console.log('\n✨ MASTER WIPE COMPLETE. The application is now in a clean state.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during wipe:', err.message);
        process.exit(1);
    }
};

wipeDatabase();
