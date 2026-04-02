import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All todo routes require authentication
router.use(protect);

// CREATE - Add a todo
router.post('/', async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      user: req.userId  // Link todo to logged in user
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all todos (only user's own todos)
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;