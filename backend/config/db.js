const mongoose = require('mongoose');
const dns = require('node:dns');

// Force Google DNS to bypass local ISP blocks (very common for MongoDB SRV in certain regions like India)
dns.setServers(['8.8.8.8', '8.8.4.4']);
// Force Node.js (v17+) to use IPv4 first
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
