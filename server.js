import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// CORS 
app.use(cors({
    origin: 'http://localhost:7000',
    credentials: true
}));

app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve frontend files
app.use(express.static('frontend'));


// Connect to MONGODB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB error:', err));


// Routes
// TEMPORARY DEBUG ROUTE - Remove later
app.get('/api/users', async (req, res) => {
  try {
    const User = await import('./models/User.js');
    const users = await User.default.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.use('/api/auth', authRoutes);    
app.use('/api/todos', todoRoutes);    


// Home route
app.get('/', (req, res) => {
    res.sendFile('frontend/index.html', { root: '.'});
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})