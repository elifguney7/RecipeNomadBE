const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors module

const { connectToDb, getDb } = require('./db');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use('/public', express.static('public'));

// MongoDB connection 
connectToDb()
.then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(err => {
    console.error('Error starting server:', err);
});

// routes
app.get('/', (req, res) => {
    res.send('Welcome to Recipe Nomad!');
});

// FOR USER OPERATIONS

const User = require('./models/User');
const { generateToken, hashPassword, validatePassword, verifyToken } = require('./utils/auth');

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await validatePassword(password, user.password)) {
      const token = generateToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user data for profile
app.get('/users/profile', verifyToken, async (req, res) => {
    try {
        // Use req.userId, which is set by the verifyToken middleware
        const user = await User.findById(req.userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Update user profile
app.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { firstName, lastName, email }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// FOR RECIPE OPERATIONS

const Recipe = require('./models/Recipe'); 
const multer = require('multer');
const path = require('path');

// Set up storage location and filenames
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with file filter and limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Function to check file types
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4|webm/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and Videos Only!');
  }
}

// POST route to create a new recipe with media
app.post('/recipes', upload.array('media', 5), async (req, res) => {
  try {
    const { title, ingredients, instructions, category } = req.body;
    const media = req.files.map(file => ({
      url: file.path, // Save the path as URL
      type: file.mimetype
    }));

    const newRecipe = new Recipe({
      title,
      ingredients,
      media,
      instructions,
      category
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Failed to create recipe:', error);
    res.status(500).json({ message: 'Failed to create recipe', error });
  }
});

// Get all Recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single Recipe
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a Recipe
app.patch('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a Recipe
app.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
