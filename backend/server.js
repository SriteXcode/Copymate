import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.js';
import notesRoutes from './routes/notes.js';
import adminRoutes from "./routes/admin.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get current directory (for static path)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files correctly (for Linux / Render)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello, world! 🌍');
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/admin', adminRoutes);

// Connect DB and Start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`)))
.catch(err => console.error('❌ MongoDB connection failed:', err));
