const mongoose = require('mongoose');

async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB conectado:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ Falha ao conectar ao MongoDB:', err.message);
    process.exit(1);   // encerra se não conseguir conectar
  }
}

module.exports = conectarDB;
