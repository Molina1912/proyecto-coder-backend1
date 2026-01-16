
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {

    await mongoose.connect('mongodb+srv://krlossmolina85_db_user:X7hkUcIQdG1XzWPD@cluster0.hwrhryr.mongodb.net/ecommerce');
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error de conexión:', error.message);
    process.exit(1);
  }
};