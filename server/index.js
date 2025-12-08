// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()


// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
//initilize
//factory
const createDatabaseManager = require('./db');

createDatabaseManager()
    .then((dbManager) => {
        const AuthController = require('./controllers/auth-controller');
        const PlaylistController = require('./controllers/store-controller');
        const SongController = require('./controllers/song-controller');
        const authController = new AuthController(dbManager);
        const playlistController = new PlaylistController(dbManager);
        const songController = new SongController(dbManager);

        app.locals.authController = authController;
        app.locals.playlistController = playlistController;
        app.locals.songController = songController;
        // SETUP OUR OWN ROUTERS AS MIDDLEWARE
        const authRouter = require('./routes/auth-router')
        app.use('/auth', authRouter)
        const storeRouter = require('./routes/store-router')
        app.use('/store', storeRouter)
        const songRouter = require('./routes/song-router')
        app.use('/store', songRouter)   
        // PUT THE SERVER IN LISTENING MODE
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

    })
    .catch(err =>{
        console.error('Database connection failed:', err);
        process.exit(1);
    });