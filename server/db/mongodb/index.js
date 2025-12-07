const DatabaseManager = require('../DatabaseManager');
const User = require('../../models/user-model');
const Playlist = require('../../models/playlist-model');
const mongoose = require('mongoose');

class MongoDBManager extends DatabaseManager {
    async connect() 
    {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true});
    }
    async disconnect()
    {
        await mongoose.disconnect();
    }
    async createUser(userData)
    {
        const newUser = new User(userData);
        return await newUser.save();
    }
    async findUserByEmail(email) 
    {
        return await User.findOne({ email: email });
    }
    async findUserById(id) 
    {
        return await User.findOne({ _id: id });
    }
    async updateUser(id, userData) 
    {
        return await User.findOneAndUpdate({ _id: id }, userData, { new: true });
    }
    async deleteUser(id) 
    {
        return await User.findOneAndDelete({ _id: id });
    }
    async addPlaylistToUser(userId, playlistId) 
    {
        const user = await User.findOne({ _id: userId });
        user.playlists.push(playlistId);
        return await user.save();
    }

    async createPlaylist(playlistData) 
    {
        const playlist = new Playlist(playlistData);
        return await playlist.save();
    }

    async getPlaylistById(id) 
    {
        return await Playlist.findById({ _id: id });
    }

    async updatePlaylist(id, playlistData) 
    {
        return await Playlist.findOneAndUpdate({ _id: id }, playlistData, { new: true });
    }

    async deletePlaylist(id) 
    {
        await Playlist.findOneAndDelete({ _id: id });
        return true;
    }

    async getPlaylistsByOwner(ownerEmail) 
    {
        return await Playlist.find({ ownerEmail: ownerEmail });
    }

    async getAllPlaylists() 
    {
        return await Playlist.find({});
    }
    async clearAllData() 
    {
        await User.deleteMany({});
        await Playlist.deleteMany({});
    }

    async bulkInsertUsers(users) 
    {
        const results = [];
        for (let u of users) 
        {
            const user = new User(u);
            results.push(await user.save());
        }
        return results;
    }

    async bulkInsertPlaylists(playlists) 
    {
        const results = [];
        for (let p of playlists) 
        {
            const playlist = new Playlist(p);
            results.push(await playlist.save());
        }
        return results;
    }
}

module.exports = MongoDBManager;
