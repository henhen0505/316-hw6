import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
import { create } from '../models/user-model';
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const createDatabaseManager = require('../db');

let dbManager;
/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
    // SETUP THE CONNECTION VIA MONGOOSE JUST ONCE - IT IS IMPORTANT TO NOTE THAT INSTEAD
    // OF DOING THIS HERE, IT SHOULD BE DONE INSIDE YOUR Database Manager (WHICHEVER)
    dbManager = await createDatabaseManager();
});

/**
 * Executed before each test is performed.
 */
beforeEach(async() => {
    await dbManager.clearAllData();
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll(async() => {
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test('Test #1) Reading a User from the Database', async() => {
    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456',
        avatar: 'default.png'
    };

    await dbManager.createUser(testUser);
    const actualUser = await dbManager.findUserByEmail('test@user.com');

    expect(actualUser.firstName).toBe(testUser.firstName);
    expect(actualUser.email).toBe(testUser.email);

});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test('Test #2) Creating a User in the Database', async() => {
    // MAKE A TEST USER TO CREATE IN THE DATABASE
    const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456',
        avatar: 'default.png'
    };

    await dbManager.createUser(testUser);
    const actualUser = await dbManager.findUserByEmail('john@doe.com');
    expect(actualUser.firstName).toBe(testUser.firstName);

});

// THE REST OF YOUR TEST SHOULD BE PUT BELOW

test('Test #3) Finding a User by ID', async () => {
    const createdUser = await dbManager.createUser({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@smith.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const foundUser = await dbManager.findUserById(createdUser._id);
    expect(foundUser.email).toBe(createdUser.email);
});

test('Test #4) Updating a User', async () => {
    const createdUser = await dbManager.createUser({
        firstName: 'Old',
        lastName: 'Name',
        email: 'old@name.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const updatedUser = await dbManager.updateUser(createdUser._id, { firstName: 'New' });
    expect(updatedUser.firstName).toBe('New');
});

test('Test #5) Deleting a User', async () => {
    const createdUser = await dbManager.createUser({
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete@me.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    await dbManager.deleteUser(createdUser._id);
    const foundUser = await dbManager.findUserById(createdUser._id);
    expect(foundUser).toBe(null);
});

test('Test #6) Creating a Playlist', async () => {
    const user = await dbManager.createUser({
        firstName: 'Owner',
        lastName: 'Test',
        email: 'owner@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const testPlaylist = {
        name: 'Test Playlist',
        owner: user._id,
        songs: [],
        listenerCount: 0,
        uniqueListeners: []
    };

    const createdPlaylist = await dbManager.createPlaylist(testPlaylist);
    const playlists = await dbManager.getPlaylistsByOwner(user._id);
    expect(playlists.length).toBe(1);
});

test('Test #7) Getting a Playlist by ID', async () => {
    const user = await dbManager.createUser({
        firstName: 'Owner',
        lastName: 'Test',
        email: 'owner@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const createdPlaylist = await dbManager.createPlaylist({
        name: 'My Playlist',
        owner: user._id,
        songs: [],
        listenerCount: 0,
        uniqueListeners: []
    });

    const foundPlaylist = await dbManager.getPlaylistById(createdPlaylist._id);
    expect(foundPlaylist.name).toBe(createdPlaylist.name);
});

test('Test #8) Updating a Playlist', async () => {
    const user = await dbManager.createUser({
        firstName: 'Owner',
        lastName: 'Test',
        email: 'owner@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const createdPlaylist = await dbManager.createPlaylist({
        name: 'Old',
        owner: user._id,
        songs: [],
        listenerCount: 0,
        uniqueListeners: []
    });

    const updatedPlaylist = await dbManager.updatePlaylist(createdPlaylist._id, { name: 'New' });
    expect(updatedPlaylist.name).toBe('New');
});

test('Test #9) Deleting a Playlist', async () => {
    const user = await dbManager.createUser({
        firstName: 'Owner',
        lastName: 'Test',
        email: 'owner@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const createdPlaylist = await dbManager.createPlaylist({
        name: 'Delete',
        owner: user._id,
        songs: [],
        listenerCount: 0,
        uniqueListeners: []
    });

    await dbManager.deletePlaylist(createdPlaylist._id);
    const foundPlaylist = await dbManager.getPlaylistById(createdPlaylist._id);
    expect(foundPlaylist).toBe(null);
});

test('Test #10) Getting Playlists by Owner', async () => {
    const user = await dbManager.createUser({
        firstName: 'Owner',
        lastName: 'Test',
        email: 'owner@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    await dbManager.createPlaylist({ 
        name: 'P1', 
        owner: user._id, 
        songs: [],
        listenerCount: 0,
        uniqueListeners: []
    });
    await dbManager.createPlaylist({ 
        name: 'P2', 
        owner: user._id, 
        songs: [],
        listenerCount: 0,
        uniqueListeners: []
    });

    const playlists = await dbManager.getPlaylistsByOwner(user._id);
    expect(playlists.length).toBe(2);
});

test('Test #11) Getting All Playlists', async () => {
    const user = await dbManager.createUser({
        firstName: 'Owner',
        lastName: 'Test',
        email: 'a@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    await dbManager.createPlaylist({ 
        name: 'PA', 
        owner: user._id, 
        songs: [],
        listenerCount: 0,
        uniqueListeners: []
    });
    
    const playlists = await dbManager.getAllPlaylists();
    expect(playlists.length >= 1).toBe(true);
});

test('Test #12) Creating a Song', async () => {
    const user = await dbManager.createUser({
        firstName: 'Artist',
        lastName: 'Test',
        email: 'artist@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const song = await dbManager.createSong({
        title: 'Test Song',
        artist: 'Test Artist',
        year: 2024,
        youTubeId: 'abc123',
        addedBy: user._id,
        listenCount: 0,
        playlistCount: 0
    });

    expect(song.title).toBe('Test Song');
});

test('Test #13) Getting a Song by ID', async () => {
    const user = await dbManager.createUser({
        firstName: 'Artist',
        lastName: 'Test',
        email: 'artist@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const createdSong = await dbManager.createSong({
        title: 'My Song',
        artist: 'Artist',
        year: 2024,
        youTubeId: 'xyz',
        addedBy: user._id,
        listenCount: 0,
        playlistCount: 0
    });

    const foundSong = await dbManager.getSongById(createdSong._id);
    expect(foundSong.title).toBe('My Song');
});

test('Test #14) Updating a Song', async () => {
    const user = await dbManager.createUser({
        firstName: 'Artist',
        lastName: 'Test',
        email: 'artist@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const createdSong = await dbManager.createSong({
        title: 'Old Title',
        artist: 'Artist',
        year: 2024,
        youTubeId: 'xyz',
        addedBy: user._id,
        listenCount: 0,
        playlistCount: 0
    });

    const updatedSong = await dbManager.updateSong(createdSong._id, { title: 'New Title' });
    expect(updatedSong.title).toBe('New Title');
});

test('Test #15) Deleting a Song', async () => {
    const user = await dbManager.createUser({
        firstName: 'Artist',
        lastName: 'Test',
        email: 'artist@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const createdSong = await dbManager.createSong({
        title: 'Delete Song',
        artist: 'Artist',
        year: 2024,
        youTubeId: 'xyz',
        addedBy: user._id,
        listenCount: 0,
        playlistCount: 0
    });

    await dbManager.deleteSong(createdSong._id);
    const foundSong = await dbManager.getSongById(createdSong._id);
    expect(foundSong).toBe(null);
});

test('Test #16) Getting All Songs', async () => {
    const user = await dbManager.createUser({
        firstName: 'Artist',
        lastName: 'Test',
        email: 'artist@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    await dbManager.createSong({
        title: 'Song 1',
        artist: 'Artist',
        year: 2024,
        youTubeId: 'abc',
        addedBy: user._id,
        listenCount: 0,
        playlistCount: 0
    });

    const songs = await dbManager.getSongs();
    expect(songs.length >= 1).toBe(true);
});

// UTILITY TESTS
test('Test #17) Clear All Data', async () => {
    await dbManager.createUser({ 
        firstName: 'T', 
        lastName: 'U', 
        email: 'clear@test.com', 
        passwordHash: 'h',
        avatar: 'default.png'
    });
    await dbManager.clearAllData();

    const users = await dbManager.findUserByEmail('clear@test.com');
    expect(users).toBe(null);
});

test('Test #18) Bulk Insert Users', async () => {
    const users = [
        { firstName: 'U1', lastName: 'T', email: 'u1@test.com', passwordHash: 'h', avatar: 'default.png' },
        { firstName: 'U2', lastName: 'T', email: 'u2@test.com', passwordHash: 'h', avatar: 'default.png' }
    ];

    const results = await dbManager.bulkInsertUsers(users);
    expect(results.length).toBe(2);
});

test('Test #19) Bulk Insert Playlists', async () => {
    const user = await dbManager.createUser({
        firstName: 'Owner',
        lastName: 'Test',
        email: 'owner@test.com',
        passwordHash: 'hash',
        avatar: 'default.png'
    });

    const playlists = [
        { name: 'P1', owner: user._id, songs: [], listenerCount: 0, uniqueListeners: [] },
        { name: 'P2', owner: user._id, songs: [], listenerCount: 0, uniqueListeners: [] }
    ];

    const results = await dbManager.bulkInsertPlaylists(playlists);
    expect(results.length).toBe(2);
});