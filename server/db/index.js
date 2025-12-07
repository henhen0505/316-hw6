const dotenv = require('dotenv');
dotenv.config();
const databaseType = process.env.DATABASE_TYPE;

let dbManager;

if (databaseType === 'mongodb') 
{
    const MongooseManager = require('./mongodb/MongooseManager');
    dbManager = new MongooseManager();
} 
else 
{
    throw new Error(`Unsupported database type: ${databaseType}`);
}

dbManager.connect().then(() => {
    console.log(`Connected to ${databaseType} database`);
}).catch(err => {
    console.error('Database connection error:', err.message);
});

module.exports = dbManager

