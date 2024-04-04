const express = require('express');
const cors = require('cors'); // Import cors module

const { connectToDb, getDb } = require('./db');
const { createUser, deleteUser, insertDummyData } = require('./userController');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// MongoDB connection 
connectToDb()
.then(() => {
    // insertDummyData().then(() => {
    //     console.log('Dummy data inserted successfully');
    // }).catch((err) => {
    //     console.error('Error inserting dummy data:', err);
    // });
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

// Route to create a new user
app.post('/users', async (req, res) => {
    try {
        // Call the createUser function from userController
        const userId = await createUser(req.body);
        res.status(201).json({ userId });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to delete a user by ID
app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const deleteCount = await deleteUser(userId);
        if (deleteCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get all users
app.get('/users', async (req, res) => {
    try {
        const db = getDb();
        const users = await db.collection('Users').find().toArray();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;
