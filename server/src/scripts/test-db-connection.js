require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const testConnection = async () => {
    console.log('🔄 Testing MongoDB Connection...');
    console.log(`📡 URI: ${process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`); // Hide password in logs

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Success! Connected to MongoDB.');
        console.log(`📊 Host: ${mongoose.connection.host}`);
        console.log(`🗄️  Database: ${mongoose.connection.name}`);

        // List collections to verify read access
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📚 Collections found: ${collections.length}`);
        collections.forEach(c => console.log(`   - ${c.name}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        process.exit(1);
    }
};

testConnection();
