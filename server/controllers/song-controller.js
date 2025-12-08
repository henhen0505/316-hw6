const auth = require('../auth')
const dbManager = require('../db');

class SongController{
    constructor(databaseManager)
    {
        this.db = databaseManager;
    }

    createSong = async(req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        const { title, artist, year, youTubeId } = req.body;
        
        if (!title || !artist || !year || !youTubeId) {
            return res.status(400).json({
                errorMessage: 'Please provide all required fields: title, artist, year, youTubeId'
            });
        }
        try{

            const songData = {
                title,
                artist,
                year,
                youTubeId,
                addedBy: req.userId,
                listenCount: 0,
                playlistCount: 0
            };
            const song = await this.db.createSong(songData);
            console.log("Song: " + song.toString());
            
            return res.status(201).json({
                success: true,
                song: song
            });
        } catch (error)
        {
            return res.status(400).json({
                errorMessage: 'Song Not Created!'
            })
        }

    }

    getSongs = async (req, res) => {
        if(auth.verifyUser(req) === null){
                return res.status(400).json({
                    errorMessage: 'UNAUTHORIZED'
                })
            }
    
            try{
                const songs = await this.db.getSongs();
                
                return res.status(200).json({ success: true, songs: songs })
            } catch(err)
            {
                console.log(err);
                return res.status(400).json({ success: false, error: err })
            }
    }

    getSongById = async (req, res) => {
            if(auth.verifyUser(req) === null){
                return res.status(400).json({
                    errorMessage: 'UNAUTHORIZED'
                })
            }
            console.log("Find Song with id: " + JSON.stringify(req.params.id));
    
            try{
                const song = await this.db.getSongById(req.params.id);
                
                if (!song) 
                {
                    return res.status(400).json({ success: false, error: "Song not found" });
                }
                
                console.log("Found song: " + JSON.stringify(song));
                console.log("req.userId: " + req.userId);
                
                return res.status(200).json({
                    success: true,
                    song: song
                });
            } catch (err)
            {
                console.log(err);
                return res.status(400).json({ success: false, error: err });
            }
    }
    
    updateSong = async (req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        const { title, artist, year, youTubeId } = req.body;
        
        if (!title || !artist || !year || !youTubeId) {
            return res.status(400).json({
                errorMessage: 'Please provide all required fields: title, artist, year, youTubeId'
            });
        }
        console.log("updateSong: " + JSON.stringify(req.body));

        try {

            const song = await this.db.getSongById(req.params.id);
            console.log("Song found: " + JSON.stringify(song));
            
            if (!song)
            {
                return res.status(404).json({
                    message: 'Song not found!',
                })
            }

            if (song.addedBy._id.toString() !== req.userId) {
                return res.status(403).json({
                    errorMessage: 'You can only edit songs you added'
                });
            }

            console.log("req.userId: " + req.userId);

            const updates = { title, artist, year, youTubeId };
            const updatedSong = await this.db.updateSong(req.params.id, updates);
        

            return res.status(200).json({
                success: true,
                song: updatedSong
            });
            
            
        } catch (err)
        {
                console.log("FAILURE: " + JSON.stringify(err));
                return res.status(404).json({
                    error: err,
                    message: 'Song not updated!',
                })
        }
    }

    deleteSong = async (req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        
        try{
            const song = await this.db.getSongById(req.params.id);
            console.log("Song found: " + JSON.stringify(song));
            
            if (!song) 
            {
                return res.status(404).json({
                    errorMessage: 'Song not found!',
                })
            }

            if (song.addedBy._id.toString() === req.userId) 
            {
                console.log("correct user!");
                await this.db.deleteSong(req.params.id);
                return res.status(200).json({});
            } 
            else 
            {
                console.log("incorrect user!");
                return res.status(403).json({ 
                    errorMessage: "authentication error" 
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                errorMessage: "Error deleting Song" 
            });
        }
    }
}




module.exports = SongController;
