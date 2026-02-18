import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.js';
import couponRoutes from './routes/coupon.js';
import paymentRoutes from './routes/payment.js';
import analyticRoute from './routes/analytic.js';
import cartRoutes from './routes/cart.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticRoute);
app.use('/api/cart', cartRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// for production, you would typically serve the frontend from the same server
if(process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(clientDistPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
