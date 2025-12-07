const DatabaseManager = require('../DatabaseManager');
const User = require('../../models/user-model');
const Playlist = require('../../models/playlist-model');
const Song = require('../../models/song-model');

class MongooseManager extends DatabaseManager {
    constructor() {
        super();
    }

    async connect() {
        return;
    }

    async disconnect() {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
    }

    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async findUserByEmail(email) {
        return await User.findOne({ email: email.toLowerCase() });
    }

    async findUserById(id) {
        return await User.findById(id).select('-passwordHash');
    }

    async updateUser(id, userData) {
        return await User.findByIdAndUpdate(
            id,
            userData,
            { new: true, runValidators: true }
        ).select('-passwordHash');
    }

    async deleteUser(id) {
        await Playlist.deleteMany({ owner: id });
        await Song.deleteMany({ addedBy: id });
        return await User.findByIdAndDelete(id);
    }

    async addPlaylistToUser(userId, playlistId) {
        return;
    }

    async createPlaylist(playlistData) {
        const playlist = new Playlist(playlistData);
        return await playlist.save();
    }

    async getPlaylistById(id) {
        return await Playlist.findById(id)
            .populate('owner', 'firstName lastName email avatar')
            .populate('songs');
    }

    async updatePlaylist(id, playlistData) {
        return await Playlist.findByIdAndUpdate(
            id,
            playlistData,
            { new: true, runValidators: true }
        )
        .populate('owner', 'firstName lastName email avatar')
        .populate('songs');
    }

    async deletePlaylist(id) {
        return await Playlist.findByIdAndDelete(id);
    }

    async getPlaylistsByOwner(ownerEmail) {
        const user = await User.findOne({ email: ownerEmail.toLowerCase() });
        if (!user) return [];
        
        return await Playlist.find({ owner: user._id })
            .populate('owner', 'firstName lastName email avatar')
            .populate('songs');
    }

    async getAllPlaylists() {
        return await Playlist.find()
            .populate('owner', 'firstName lastName email avatar')
            .populate('songs');
    }

    async createSong(songData) {
        const song = new Song(songData);
        return await song.save();
    }

    async getSongs(query) {
        return await Song.find(query)
            .populate('addedBy', 'firstName lastName email avatar')
            .sort({ createdAt: -1 });
    }

    async getSongById(id) {
        return await Song.findById(id)
            .populate('addedBy', 'firstName lastName email avatar');
    }

    async updateSong(id, songData) {
        return await Song.findByIdAndUpdate(
            id,
            songData,
            { new: true, runValidators: true }
        ).populate('addedBy', 'firstName lastName email avatar');
    }

     async deleteSong(id) {
        await Playlist.updateMany(
            { songs: id },
            { $pull: { songs: id } }
        );
        
        return await Song.findByIdAndDelete(id);
     }
    

    async clearAllData() {
        await User.deleteMany({});
        await Playlist.deleteMany({});
        await Song.deleteMany({});
    }

    async bulkInsertUsers(users) {
        return await User.insertMany(users);
    }

    async bulkInsertPlaylists(playlists) {
        return await Playlist.insertMany(playlists);
    }
}

module.exports = MongooseManager;