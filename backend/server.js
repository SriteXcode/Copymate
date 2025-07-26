import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.js';
import notesRoutes from './routes/notes.js';
import adminRoutes from "./routes/admin.js";
import auth from './middleware/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/admin', adminRoutes);

// Connect DB and Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
.catch(err => console.error('MongoDB connection failed:', err));
