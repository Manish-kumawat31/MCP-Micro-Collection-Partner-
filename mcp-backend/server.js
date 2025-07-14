import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import mcpRoutes from './routes/mcp.routes.js';
import partnerRoute from './routes/partner.route.js'
import orderRoute from './routes/order.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'https://mcp-system-mocha.vercel.app', credentials: true }));


  
// API routes (to be created later)
app.use('/api/auth', authRoutes);
app.use('/api/mcp' , mcpRoutes);
app.use('/api/partners' , partnerRoute);
app.use('/api/orders' , orderRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
