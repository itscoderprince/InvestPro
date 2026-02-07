const mongoose = require('mongoose');
const uri = "mongodb+srv://itscoderprince_db_user:TgFYTCFfrNMK6Y7j@cluster0.j96njly.mongodb.net/?appName=Cluster0";

async function test() {
    console.log('Connecting to MongoDB...');
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Success! Connected to:', conn.connection.name);
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Failed:', err.message);
        process.exit(1);
    }
}

test();
