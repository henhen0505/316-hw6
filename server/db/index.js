const dotenv = require('dotenv');
dotenv.config();
const databaseType = process.env.DATABASE_TYPE;

async function createDatabaseManager() {
    if(databaseType=== 'mongodb')
    {
        const MongooseManager = require('./mongodb/MongooseManager');
        const mongoose = require('mongoose');

        await mongoose.connect(process.env.DB_CONNECT);

        return new MongooseManager();
    }
    else 
    {
        throw new Error(`Unsupported database type: ${DATABASE_TYPE}`);
    }
}


module.exports = createDatabaseManager

