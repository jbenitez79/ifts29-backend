const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        const connectionType = process.env.MONGODB_URI.includes('localhost') ? 'Local' : 'Atlas/Nube';
        console.log(`Conectado a MongoDB (${connectionType}): ${conn.connection.host}`);
    } catch (error) {
        console.error('Error conectando MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;