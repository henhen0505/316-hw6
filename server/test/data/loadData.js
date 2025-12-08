const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../../models/user-model');
const Playlist = require('../../models/playlist-model');
const Song = require('../../models/song-model');
const testData = require('./example-db-data.json');


async function loadData()
{
    try{

        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Playlist.deleteMany({});
        await Song.deleteMany({});
        console.log('Cleared existing data');

        const users = await User.insertMany(testData.users);
        console.log('Created Users');

        const userMap = {};
        users.forEach(user => 
        {
            userMap[user.email] = user;
        });

        const songsWithUser = testData.songs.map(song => (
            {
                ...song,
                addedBy: users[0]._id,
                listenCount: 0,
                playlistCount: 0
            }
        ));

        const songs = await Song.insertMany(songsWithUser);
        console.log('Created Songs');

        for (const playlistData of testData.playlists) 
        {
            const owner = userMap[playlistData.ownerEmail];
            const songIds = playlistData.songIndices.map(index => songs[index]._id);

            await Playlist.create(
            {
                name: playlistData.name,
                owner: owner._id,
                songs: songIds,
                listenerCount: 0,
                uniqueListeners: []
            });
        }

        console.log('Created Playlists');

    }
    catch (error) 
    {
        console.error('Error loading test data:', error);
        process.exit(1);
    }
}

loadData();