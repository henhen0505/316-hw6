const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const songSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        artist: { type: String, required: true, trim: true },
        year: { 
            type: Number, 
            required: true,
            min: 1900,
            max: 2100
        },
        youTubeId: { 
            type: String, 
            required: true, 
            trim: true
        },
        addedBy: { type: ObjectId, ref: 'User', required: true },
        listenCount: { type: Number, default: 0, min: 0 },
        playlistCount: { type: Number, default: 0, min: 0 }
    },
    { timestamps: true }

)

songSchema.index({ title: 1, artist: 1, year: 1 }, { unique: true })

module.exports = mongoose.models.Song || mongoose.model('Song', songSchema);
