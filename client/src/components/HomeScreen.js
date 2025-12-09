import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import PlaylistCard from './PlaylistCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import YouTubePlayerModal from './YoutubePlayerModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
        
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        const playlistsToDisplay = store.getFilteredPlaylists();
        listCard = 
            <List sx={{width: '100%', bgcolor: 'background.paper', mb:"20px"}}>
            {

                playlistsToDisplay.map((pair) => ( 
                    <PlaylistCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
                
            }
            <Fab sx={{transform:"translate(1150%, 10%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
            <Fab sx={{transform:"translate(-20%, 0%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                Your Playlists
            </div>
            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>  
                <TextField
                    fullWidth
                    label="Search Playlists"
                    variant="outlined"
                    value={store.searchQuery}
                    onChange={(e) => store.setSearchQuery(e.target.value)}
                    placeholder="Type to filter playlists..."
                />
            </Box>
            <Box sx={{ p: 2, bgcolor: 'background.paper', zIndex:100, position: 'relative' }}>
                <FormControl fullWidth variant="outlined" sx={{ bgcolor: 'white' }}>
                    <InputLabel id="sort-by-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        id="sort-by-select"
                        value={store.sortBy}
                        label="Sort By"
                        onChange={(e) => {
                            console.log("Sort changed to:", e.target.value);
                            store.setSortBy(e.target.value);
                        }}
                        onClick={() => console.log("Sort dropdown clicked")}
                    >
                        <MenuItem value="name-az">Name (A-Z)</MenuItem>
                        <MenuItem value="name-za">Name (Z-A)</MenuItem>
                        <MenuItem value="date-newest">Date (Newest First)</MenuItem>
                        <MenuItem value="date-oldest">Date (Oldest First)</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{bgcolor:"background.paper", position: "relative", marginTop:'10%', height: "auto", paddingTop:2}} id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
                <YouTubePlayerModal />
            </Box>
        </div>)
}

export default HomeScreen;