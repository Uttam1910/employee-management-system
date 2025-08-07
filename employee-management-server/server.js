import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes.js';
import pool from './db.js';

pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ DB Connected:', res.rows[0]);
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
  });

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/employees', employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
