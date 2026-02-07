const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function test() {
    console.log('Testing connection to:', process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connected!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
}

test();
