import app from './app.js';
import { connectDB } from './src/config/database.js';

const PORT = process.env.PORT || 8080;


connectDB();


app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});