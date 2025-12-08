const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        owner: { type: ObjectId, ref: 'User', required: true },
        songs: [{ type: ObjectId, ref: 'Song' }],
        listenerCount: { type: Number, default: 0 },
        uniqueListeners: [{ type: ObjectId, ref: 'User' }]
    },
    { timestamps: true },
)

playlistSchema.index({ owner: 1, name: 1 }, { unique: true })

module.exports = mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);
