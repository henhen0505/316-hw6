/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const router = express.Router()
const auth = require('../auth')


router.post('/playlist', auth.verify, (req, res) => {
    req.app.locals.playlistController.createPlaylist(req, res);
});

router.delete('/playlist/:id', auth.verify, (req, res) => {
    req.app.locals.playlistController.deletePlaylist(req, res);
});

router.get('/playlist/:id', auth.verify, (req, res) => {
    req.app.locals.playlistController.getPlaylistById(req, res);
});

router.get('/playlistpairs', auth.verify, (req, res) => {
    req.app.locals.playlistController.getPlaylistPairs(req, res);
});

router.get('/playlists', auth.verify, (req, res) => {
    req.app.locals.playlistController.getPlaylists(req, res);
});

router.put('/playlist/:id', auth.verify, (req, res) => {
    req.app.locals.playlistController.updatePlaylist(req, res);
});

router.put('/playlist/:id/publish', auth.verify, (req, res) => {
    req.app.locals.playlistController.publishPlaylist(req, res);
});

module.exports = router