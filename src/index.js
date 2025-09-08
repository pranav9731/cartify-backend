import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import cartRoutes from './routes/cart.js';
import './routes/seed.js';

console.log("Backend starting...");

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

const port = process.env.PORT || 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on port ${port}`);
});



