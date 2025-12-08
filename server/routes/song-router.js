const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.post('/song', auth.verify, (req, res) => {
    req.app.locals.songController.createSong(req, res);
});

router.get('/songs', auth.verify, (req, res) => {
    req.app.locals.songController.getSongs(req, res);
});

router.get('/song/:id', auth.verify, (req, res) => {
    req.app.locals.songController.getSongById(req, res);
});

router.put('/song/:id', auth.verify, (req, res) => {
    req.app.locals.songController.updateSong(req, res);
});

router.delete('/song/:id', auth.verify, (req, res) => {
    req.app.locals.songController.deleteSong(req, res);
});

module.exports = router;