const dotenv = require('dotenv');
dotenv.config();
const databaseType = process.env.DATABASE_TYPE;

let dbManager;

if (databaseType === 'mongodb') 
{
    const MongoDBManager = require('./mongodb');
    dbManager = new MongoDBManager();
} 
else if (databaseType === 'postgresql') 
{
    const PostgreSQLManager = require('./postgresql');
    dbManager = new PostgreSQLManager();
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

