import { jsTPS_Transaction } from "jstps"
/**
 * CreateSong_Transaction
 * 
 * This class represents a transaction that creates a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 */
export default class CreateSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initSong) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.song = initSong;
        this.createdSongId = null;
    }

    async executeDo() {
        
        console.log("CreateSong_Transaction: executeDo() called");
        console.log("Song data:", this.song)

        if (this.createdSongId) {
            this.store.createSong(this.index, this.createdSongId);
            return;
        }

        const createdSong = await this.store.createSongInCatalog(
            this.song.title,
            this.song.artist,
            this.song.year,
            this.song.youTubeId
        );

        console.log("Created song:", createdSong);


         if (createdSong) {
            this.createdSongId = createdSong._id;
            this.store.createSong(this.index, this.createdSongId);
        }
    }
    
    
    executeUndo() {
        this.store.removeSong(this.index);
    }
}