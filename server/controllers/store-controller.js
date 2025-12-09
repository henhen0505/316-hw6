const auth = require('../auth')
const dbManager = require('../db');

/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
class PlaylistController{
    constructor(databaseManager)
    {
        this.db = databaseManager;
    }

    createPlaylist = async(req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        const {name} = req.body;
        console.log("createPlaylist name: " + JSON.stringify(name));
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a Playlist name',
            })
        }
        try{
            const playlist = await this.db.createPlaylist({
                name,
                owner: req.userId,
                songs: [],
                listenerCount: 0,
                uniqueListeners: []
            });
            console.log("playlist: " + playlist.toString());
            
            return res.status(201).json({
                playlist: playlist
            })
        } catch (error)
        {
            console.error("CREATE PLAYLIST ERROR:", error);
            return res.status(400).json({
                errorMessage: 'Playlist Not Created!'
            })
        }

    }
    deletePlaylist = async (req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
        console.log("delete " + req.params.id);
        try{
            const playlist = await this.db.getPlaylistById(req.params.id);
            console.log("playlist found: " + JSON.stringify(playlist));
            
            if (!playlist) 
            {
                return res.status(404).json({
                    errorMessage: 'Playlist not found!',
                })
            }

            console.log("playlist.owner._id: " + playlist.owner._id);
            console.log("req.userId: " + req.userId);
            if (playlist.owner._id.toString() === req.userId) 
            {
                console.log("correct user!");
                await this.db.deletePlaylist(req.params.id);
                return res.status(200).json({});
            } 
            else 
            {
                console.log("incorrect user!");
                return res.status(400).json({ 
                    errorMessage: "authentication error" 
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                errorMessage: "Error deleting playlist" 
            });
        }
    }
    getPlaylistById = async (req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

        try{
            const list = await this.db.getPlaylistById(req.params.id);
            
            if (!list) 
            {
                return res.status(400).json({ success: false, error: "Playlist not found" });
            }
            
            console.log("Found list: " + JSON.stringify(list));

            console.log("list.owner._id: " + list.owner._id);
            console.log("req.userId: " + req.userId);
            
            if (list.owner._id.toString() === req.userId) 
            {
                console.log("correct user!");
                return res.status(200).json({ success: true, playlist: list })
            } 
            else 
            {
                console.log("incorrect user!");
                return res.status(400).json({ success: false, description: "authentication error" });
            }
        } catch (err)
        {
            console.log(err);
            return res.status(400).json({ success: false, error: err });
        }
    }
    getPlaylistPairs = async (req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        console.log("getPlaylistPairs");
        try{
            const user = await this.db.findUserById(req.userId);
            console.log("find user with id " + req.userId);
            
            console.log("find all Playlists owned by " + user._id);
            const playlists = await this.db.getPlaylistsByOwner(user._id);
            console.log("found Playlists: " + JSON.stringify(playlists));
            
            if (!playlists) 
            {
                console.log("!playlists.length");
                return res
                    .status(404)
                    .json({ success: false, error: 'Playlists not found' })
            }
            console.log("Send the Playlist pairs");
            let pairs = [];
            for (let key in playlists) 
            {
                let list = playlists[key];
                let pair = 
                {
                    _id: list._id,
                    name: list.name,
                    songCount : list.songs.length,
                    createdAt: list.createdAt,
                    published: list.published
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        } catch (err)
        {
            console.log(err);
            return res.status(400).json({ success: false, error: err })
        }

    }
    getPlaylists = async (req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }

        try{
            const playlists = await this.db.getAllPlaylists();
            
            if (!playlists.length) 
            {
                return res
                    .status(404)
                    .json({ success: false, error: `Playlists not found` })
            }
            return res.status(200).json({ success: true, data: playlists })
        } catch(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, error: err })
        }
    }
    updatePlaylist = async (req, res) => {
        if(auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        const body = req.body
        console.log("updatePlaylist: " + JSON.stringify(body));
        console.log("req.body.name: " + req.body.name);

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }

    try {

            const playlist = await this.db.getPlaylistById(req.params.id);
            console.log("playlist found: " + JSON.stringify(playlist));
            
            if (!playlist)
            {
                return res.status(404).json({
                    message: 'Playlist not found!',
                })
            }

            console.log("playlist.owner._id: " + playlist.owner._id);   
            console.log("req.userId: " + req.userId);
            
            if (playlist.owner._id.toString() === req.userId) 
            {
                console.log("correct user!");
                console.log("req.body.name: " + req.body.name);

                playlist.name = body.playlist.name;
                playlist.songs = body.playlist.songs;
                
                await this.db.updatePlaylist(playlist._id, playlist);
                
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: playlist._id,
                    message: 'Playlist updated!',
                })
            }
            else
            {
                console.log("incorrect user!");
                return res.status(400).json({ success: false, description: "authentication error" });
            }
    } catch (err)
    {
            console.log("FAILURE: " + JSON.stringify(err));
            return res.status(404).json({
                error: err,
                message: 'Playlist not updated!',
            })
    }
    }


    publishPlaylist = async (req, res) => {
        if(auth.verifyUser(req) === null)
            {
            return res.status(400).json({
                errorMessage: 'UNAUTHORIZED'
            })
        }
        
        try {
            const playlist = await this.db.getPlaylistById(req.params.id);
            
            if (!playlist) 
            {
                return res.status(404).json({ error: 'Playlist not found' });
            }
            
            if (playlist.owner._id.toString() !== req.userId) 
            {
                return res.status(400).json({ error: 'Unauthorized' });
            }
            
            playlist.published = req.body.published;
            await this.db.updatePlaylist(playlist._id, playlist);
            
            return res.status(200).json({ success: true, playlist });
        } 
        catch (err) {
            console.error("PUBLISH PLAYLIST ERROR:", err);
            return res.status(400).json({ error: err.message });
        }
    }
}
module.exports = PlaylistController;