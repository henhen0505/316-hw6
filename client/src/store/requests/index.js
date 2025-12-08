/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

const baseURL= 'http://localhost:4000/store';


// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

const fetchRequest = async(url, options = {}) =>{
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json',
        },
        ...options
    };

    try{
        const response = await fetch(url, defaultOptions);
        const data = await response.json();

        return {
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
export const createPlaylist = (newListName, songIds = []) => {
    return fetchRequest(`${baseURL}/playlist/`, {
        method: 'POST',
        body: JSON.stringify({
            name: newListName,
            songs: songIds,
            listenerCount: 0,
            uniqueListeners: []
        })
    });
};
export const deletePlaylistById = (id) => {
    return fetchRequest(`${baseURL}/playlist/${id}`, {
        method : 'DELETE'
    });
};
export const getPlaylistById = (id) => {
    return fetchRequest(`${baseURL}/playlist/${id}`, {
        method: 'GET'
    });
};
export const getPlaylistPairs = () => {
    return fetchRequest(`${baseURL}/playlistpairs/`, {
        method : 'GET',
    });
};
export const updatePlaylistById = (id, playlist) => {
    return fetchRequest(`${baseURL}/playlist/${id}`, {
        method:'PUT',
        body : JSON.stringify({
            playlist:playlist
        })
    });
};



export const createSong = (title, artist, year, youTubeId) => {
    return fetchRequest(`${baseURL}/song/`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            artist,
            year,
            youTubeId
        })
    });
};

export const getAllSongs = () => {
    return fetchRequest(`${baseURL}/songs/`, {
        method: 'GET'
    });
};

export const getSongById = (id) => {
    return fetchRequest(`${baseURL}/song/${id}`, {
        method: 'GET'
    });
};

export const updateSongById = (id, songData) => {
    return fetchRequest(`${baseURL}/song/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: songData.title,
            artist: songData.artist,
            year: songData.year,
            youTubeId: songData.youTubeId
        })
    });
}

export const deleteSongById = (id) => {
    return fetchRequest(`${baseURL}/song/${id}`, {
        method: 'DELETE'
    });
};



const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById,
    createSong,
    getAllSongs,
    getSongById,
    updateSongById,
    deleteSongById
}

export default apis
