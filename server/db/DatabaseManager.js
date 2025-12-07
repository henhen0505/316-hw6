class DatabaseManager {
    constructor() {
        if (this.constructor === DatabaseManager) 
        {
            throw new Error('');
        }
    }

    async connect() {
        throw new Error('connect() must be implemented');
    }

    async disconnect() {
        throw new Error('disconnect() must be implemented');
    }
    async createUser(userData) {
        throw new Error('createUser() must be implemented');
    }

    async findUserByEmail(email) {
        throw new Error('findUserByEmail() must be implemented');
    }

    async findUserById(id) {
        throw new Error('findUserById() must be implemented');
    }

    async updateUser(id, userData) {
        throw new Error('updateUser() must be implemented');
    }

    async deleteUser(id) {
        throw new Error('deleteUser() must be implemented');
    }

    async addPlaylistToUser(userId, playlistId) {
        throw new Error('addPlaylistToUser() must be implemented');
    }
    async createPlaylist(playlistData) {
        throw new Error('createPlaylist() must be implemented');
    }

    async getPlaylistById(id) {
        throw new Error('getPlaylistById() must be implemented');
    }

    async updatePlaylist(id, playlistData) {
        throw new Error('updatePlaylist() must be implemented');
    }

    async deletePlaylist(id) {
        throw new Error('deletePlaylist() must be implemented');
    }

    async getPlaylistsByOwner(ownerEmail) {
        throw new Error('getPlaylistsByOwner() must be implemented');
    }

    async getAllPlaylists() {
        throw new Error('getAllPlaylists() must be implemented');
    }

    async clearAllData() {
        throw new Error('clearAllData() must be implemented');
    }

    async bulkInsertUsers(users) {
        throw new Error('bulkInsertUsers() must be implemented');
    }

    async bulkInsertPlaylists(playlists) {
        throw new Error('bulkInsertPlaylists() must be implemented');
    }

    async createSong(songData) {
        throw new Error('createSong() must be implemented');
    }

    async getSongs(query) {
        throw new Error('getSongs() must be implemented');
    }

    async getSongById(id) {
        throw new Error('getSongById() must be implemented');
    }

    async updateSong(id, songData) {
        throw new Error('updateSong() must be implemented');
    }

    async deleteSong(id) {
        throw new Error('deleteSong() must be implemented');
    }
}   



module.exports = DatabaseManager;