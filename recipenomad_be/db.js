// const { MongoClient } = require('mongodb');

// let dbConnection;

// module.exports = {
//     connectToDb: () => {
//         return new Promise((resolve, reject) => {
//             MongoClient.connect('mongodb://test:abc123@127.0.0.1:27017/RecipeNomadDB')
//             .then(client => {
//                 dbConnection = client.db();
//                 console.log('Connected to MongoDB');
//                 resolve();
//             })
//             .catch(err => {
//                 console.error('Error connecting to MongoDB:', err);
//                 reject(err);
//             });  
//         });  
//     },
//     getDb: () => dbConnection
// }
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');


let dbConnection;

module.exports = {
    connectToDb: () => {
        return new Promise((resolve, reject) => {
            const dbUri = 'mongodb://test:abc123@127.0.0.1:27017/RecipeNomadDB';
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,  // Attempt to connect for 5 seconds
                socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
            };

            MongoClient.connect(dbUri, options)
            .then(client => {
                dbConnection = client.db('RecipeNomadDB'); // Explicitly specify the database name
                console.log('Connected to MongoDB:', dbConnection.databaseName);
                resolve();
            })
            .catch(err => {
                console.error('Error connecting to MongoDB:', err);
                reject(err);
            });


            mongoose.connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
                }).then(() => {
                    console.log('Mongoose connected to DB');
                }).catch(err => {
                    console.error('Mongoose connection error:', err);
                });
        });
    },
    getDb: () => {
        if (!dbConnection) {
            throw new Error('No database connected!');
        }
        return dbConnection;
    }
};
