import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const dbManager = require('../db');

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
    await dbManager.connect();
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
    await dbManager.disconnect();
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
        passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456'
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
    const testUser = 
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456'
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
        passwordHash: 'hash'
    });

    const foundUser = await dbManager.findUserById(createdUser._id);
    expect(foundUser.email).toBe(createdUser.email);
});

test('Test #4) Updating a User', async () => {
    const createdUser = await dbManager.createUser({
        firstName: 'Old',
        lastName: 'Name',
        email: 'old@name.com',
        passwordHash: 'hash'
    });

    const updatedUser = await dbManager.updateUser(createdUser._id, { firstName: 'New' });
    expect(updatedUser.firstName).toBe('New');
});

test('Test #5) Deleting a User', async () => {
    const createdUser = await dbManager.createUser({
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete@me.com',
        passwordHash: 'hash'
    });

    await dbManager.deleteUser(createdUser._id);
    const foundUser = await dbManager.findUserById(createdUser._id);
    expect(foundUser).toBe(null);
});

test('Test #6) Creating a Playlist', async () => {
    const testPlaylist = {
        name: 'Test Playlist',
        ownerEmail: 'test@owner.com',
        songs: []
    };

    await dbManager.createPlaylist(testPlaylist);
    const playlists = await dbManager.getPlaylistsByOwner('test@owner.com');
    expect(playlists.length).toBe(1);
});

test('Test #7) Getting a Playlist by ID', async () => {
    const createdPlaylist = await dbManager.createPlaylist({
        name: 'My Playlist',
        ownerEmail: 'owner@test.com',
        songs: []
    });

    const foundPlaylist = await dbManager.getPlaylistById(createdPlaylist._id);
    expect(foundPlaylist.name).toBe(createdPlaylist.name);
});

test('Test #8) Updating a Playlist', async () => {
    const createdPlaylist = await dbManager.createPlaylist({
        name: 'Old',
        ownerEmail: 'owner@test.com',
        songs: []
    });

    const updatedPlaylist = await dbManager.updatePlaylist(createdPlaylist._id, { name: 'New' });
    expect(updatedPlaylist.name).toBe('New');
});

test('Test #9) Deleting a Playlist', async () => {
    const createdPlaylist = await dbManager.createPlaylist({
        name: 'Delete',
        ownerEmail: 'owner@test.com',
        songs: []
    });

    await dbManager.deletePlaylist(createdPlaylist._id);
    const foundPlaylist = await dbManager.getPlaylistById(createdPlaylist._id);
    expect(foundPlaylist).toBe(null);
});

test('Test #10) Getting Playlists by Owner', async () => {
    await dbManager.createPlaylist({ name: 'P1', ownerEmail: 'owner@test.com', songs: [] });
    await dbManager.createPlaylist({ name: 'P2', ownerEmail: 'owner@test.com', songs: [] });

    const playlists = await dbManager.getPlaylistsByOwner('owner@test.com');
    expect(playlists.length).toBe(2);
});

test('Test #11) Getting All Playlists', async () => {
    await dbManager.createPlaylist({ name: 'PA', ownerEmail: 'a@test.com', songs: [] });
    
    const playlists = await dbManager.getAllPlaylists();
    expect(playlists.length >= 1).toBe(true);
});

test('Test #12) Adding Playlist to User', async () => {
    const user = await dbManager.createUser({
        firstName: 'User',
        lastName: 'Owner',
        email: 'user@test.com',
        passwordHash: 'hash'
    });

    const playlist = await dbManager.createPlaylist({
        name: 'Playlist',
        ownerEmail: 'user@test.com',
        songs: []
    });

    const updatedUser = await dbManager.addPlaylistToUser(user._id, playlist._id);
    expect(updatedUser.playlists.length).toBe(1);
});

test('Test #13) Clear All Data', async () => {
    await dbManager.createUser({ firstName: 'T', lastName: 'U', email: 'clear@test.com', passwordHash: 'h' });
    await dbManager.clearAllData();

    const users = await dbManager.findUserByEmail('clear@test.com');
    expect(users).toBe(null);
});

test('Test #14) Bulk Insert Users', async () => {
    const users = [
        { firstName: 'U1', lastName: 'T', email: 'u1@test.com', passwordHash: 'h' },
        { firstName: 'U2', lastName: 'T', email: 'u2@test.com', passwordHash: 'h' }
    ];

    const results = await dbManager.bulkInsertUsers(users);
    expect(results.length).toBe(2);
});

test('Test #15) Bulk Insert Playlists', async () => {
    const playlists = [
        { name: 'P1', ownerEmail: 'test@test.com', songs: [] },
        { name: 'P2', ownerEmail: 'test@test.com', songs: [] }
    ];

    const results = await dbManager.bulkInsertPlaylists(playlists);
    expect(results.length).toBe(2);
});