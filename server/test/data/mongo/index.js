const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });

const MongoDBManager = require('../../../db/mongodb/MongooseManager')


async function resetMongo() {
    const testData = require("../example-db-data.json");
    const dbManager = new MongoDBManager();

    try{
        await dbManager.connect();
        console.log("Resetting the Mongo DB");

        await dbManager.clearAllData();
        console.log("Database cleared");
        
        await dbManager.bulkInsertUsers(testData.users);
        console.log("Users inserted");

        await dbManager.bulkInsertPlaylists(testData.playlists);
        console.log("Playlists inserted");
        
        console.log("MongoDB reset complete!");
        await dbManager.disconnect();
        process.exit(0);
    }
    catch (err) {
        console.error(" Error resetting MongoDB:", err);
        process.exit(1);
    }
}

resetMongo();
