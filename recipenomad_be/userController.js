const { getDb } = require('./db');

// Function to create a new user
async function createUser(userData) {
    try {
        const db = await getDb();
        const result = await db.collection('Users').insertOne(userData);
        return result.insertedId;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}

// Function to delete a user by ID
async function deleteUser(userId) {
    try {
        const db = await getDb();
        const result = await db.collection('Users').deleteOne({ _id: userId });
        return result.deletedCount;
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    }
}

// Function to insert dummy data for testing
async function insertDummyData() {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users'); 

         // Insert dummy data
         const result = await usersCollection.insertMany([
            { username: 'user1', email: 'user1@example.com', age: 25 },
            { username: 'user2', email: 'user2@example.com', age: 30 },
            { username: 'user3', email: 'user3@example.com', age: 35 }
        ]);
        console.log('Dummy data inserted successfully:', result.insertedCount);
    } catch (err) {
        console.error('Error inserting dummy data:', err);
        throw err;
    }
}

module.exports = { createUser, deleteUser, insertDummyData };
