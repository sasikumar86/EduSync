const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // Log sanitized URI for debugging on Render
        const sanitizedUri = uri.replace(/:([^:@]+)@/, ':****@');
        console.log(`🔄 Attempting to connect to: ${sanitizedUri}`);

        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error (${error.name}): ${error.message}`);
        // Do not exit process, allow server to start for landing page
        return false;
    }
};

module.exports = connectDB;
