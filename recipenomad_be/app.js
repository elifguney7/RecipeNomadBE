const express = require('express');
const { connectToDb, getDb } = require('./db')

const app = express();

// MongoDB connection 
let db
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        })
        db = getDb()
    }
})



// routes
app.get('/', (req, res) => {
    res.send('Welcome to Recipe Nomad!');
});

