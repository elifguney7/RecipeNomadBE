const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectToDb: () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect('mongodb://test:abc123@127.0.0.1:27017/RecipeNomadDB')
            .then(client => {
                dbConnection = client.db();
                console.log('Connected to MongoDB');
                resolve();
            })
            .catch(err => {
                console.error('Error connecting to MongoDB:', err);
                reject(err);
            });  
        });  
    },
    getDb: () => dbConnection
}
