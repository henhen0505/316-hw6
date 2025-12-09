import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: '#90EE90',
    border: '3px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'row'
};

export default function YoutubePlayerModal() 
{   

   
    //trackers
    const { store } = useContext(GlobalStoreContext);
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    console.log("Modal rendering - isPlayerOpen:", store.isPlayerOpen);
    console.log("Modal rendering - currentList:", store.currentList);
    const playlist = store.currentList;
    const currentSongIndex = store.playerSongIndex;
    let currentSong = null;
    if (playlist && playlist.songs && playlist.songs[currentSongIndex]) 
    {
        currentSong = playlist.songs[currentSongIndex];
    }


    //intialize
    function initializePlayer()
    {
        console.log("Creating YouTube player");

        if(!window.YT || !window.YT.Player)
        {
            setTimeout(initializePlayer, 100);
            return;
        }

        if (!currentSong) 
        {
            console.log("No current song");
            return;
        }

        console.log("Initializing player for videoId:", currentSong.youTubeId);
        const playerDiv = document.getElementById('youtube-player');
        if (playerDiv) 
        {
            console.log("Clearing player div, innerHTML length:", playerDiv.innerHTML.length);
            playerDiv.innerHTML = '';
        }
        console.log("new yt.player");
        new window.YT.Player('youtube-player', 
        {
            height: '390',
            width: '640',
            videoId: currentSong.youTubeId,
            events: {
                'onReady': handlePlayerReady,
                'onStateChange': handlePlayerStateChange
            }
        });
        
    }


    function handlePlayerReady(event) 
    {
        console.log("handlePlayerReady fired!");
        console.log("Event target:", event.target);
        const ytPlayer = event.target;
        console.log("Setting player state");
        setPlayer(ytPlayer);
        console.log("Calling playVideo");
        ytPlayer.playVideo();
        setIsPlaying(true);
        console.log("handlePlayerReady complete");
    }

    function handlePlayerStateChange(event) 
    {
        if (event.data === 0) {
            handleNext();
        } 
        else if (event.data === 1) 
        {
            setIsPlaying(true);
        } 
        else if (event.data === 2) 
        {
            setIsPlaying(false);
        }
    }


    function handlePlayPause() 
    {
        if (!player) 
        {
            return;
        }
        
        if (isPlaying) 
        {
            player.pauseVideo();
        } else 
        {
            player.playVideo();
        }
    }

    function handleNext() 
    {
        if (!playlist) 
            {
            return;
        }
        
        let nextIndex = currentSongIndex + 1;
        //go back to beginning
        if (nextIndex >= playlist.songs.length) 
        {
            nextIndex = 0;
        }
        
        store.setPlayerSong(nextIndex);
        //load
        if (player && playlist.songs[nextIndex]) 
        {
            player.loadVideoById(playlist.songs[nextIndex].youTubeId);
        }
    }

    function handlePrevious() 
    {
        if (!playlist) 
        {
            return;
        }
        
        let prevIndex = currentSongIndex - 1;
        //loop to end
        if (prevIndex < 0) 
        {
            prevIndex = playlist.songs.length - 1;
        }
        
        store.setPlayerSong(prevIndex);
        
        if (player && playlist.songs[prevIndex]) 
        {
            player.loadVideoById(playlist.songs[prevIndex].youTubeId);
        }
    }

    function handleSongClick(index) 
    {
        store.setPlayerSong(index);
        
        if (player && playlist.songs[index]) 
        {
            player.loadVideoById(playlist.songs[index].youTubeId);
        }
    }

    function handleClose() 
    {
        if (player) 
        {
            if (player.stopVideo) 
            {
                player.stopVideo();
            }
            if (player.destroy) 
            {
                player.destroy();
            }
        }
        setPlayer(null);
        store.closePlayer();
    }

    function handleToggleRepeat() 
    {
        store.toggleRepeat();
    }

    useEffect(() => {
            console.log("useEffect running");
            console.log("isPlayerOpen:", store.isPlayerOpen);
            console.log("player exists:", !!player);
            console.log("currentSong exists:", !!currentSong);
            
            if (store.isPlayerOpen && !player && currentSong) 
            {
                console.log("Calling initializePlayer");
                initializePlayer();
            } 
            else {
                console.log("Not initializing - conditions not met");
            }
            
        
    }, [store.isPlayerOpen, player, currentSong]);

    //base case for earlier if not open, dont render
    if (!store.isPlayerOpen || !playlist) {
        return null;
    }

    

    return (
        <Modal open={store.isPlayerOpen} onClose={handleClose}>
            <Box sx={style}>
                {/*on the left*/ }
                <Box sx={{ width: '40%', pr: 2, overflowY: 'auto' }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {playlist.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        By {playlist.owner.firstName} {playlist.owner.lastName}
                    </Typography>
                    
                    {/*map */}
                    {playlist.songs.map((song, index) => (
                        <Box
                            key={song._id}
                            onClick={() => handleSongClick(index)}
                            sx={{
                                p: 1,
                                mb: 1,
                                bgcolor: index === currentSongIndex ? '#FFD700' : '#FFFFFF',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: index === currentSongIndex ? '#FFD700' : '#F0F0F0'
                                }
                            }}
                        >
                            <Typography sx={{ fontWeight: index === currentSongIndex ? 'bold' : 'normal' }}>
                                {index + 1}. {song.title} by {song.artist} ({song.year})
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* right and controls */}
                <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                        <div id="youtube-player"></div>
                    </Box>

                    {currentSong && (
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Now Playing: {currentSong.title} by {currentSong.artist} ({currentSong.year})
                        </Typography>
                    )}

                    {/* Controls */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <IconButton 
                            onClick={handlePrevious}
                            sx={{ bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#F0F0F0' } }}
                        >
                            <SkipPreviousIcon fontSize="large" />
                        </IconButton>
                        
                        <IconButton 
                            onClick={handlePlayPause}
                            sx={{ bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#F0F0F0' } }}
                        >
                            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                        </IconButton>
                        
                        <IconButton 
                            onClick={handleNext}
                            sx={{ bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#F0F0F0' } }}
                        >
                            <SkipNextIcon fontSize="large" />
                        </IconButton>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={store.playerRepeat} 
                                onChange={handleToggleRepeat}
                            />
                        }
                        label="Repeat"
                    />

                    <Button 
                        onClick={handleClose}
                        variant="contained"
                        sx={{ 
                            mt: 'auto',
                            bgcolor: '#008000',
                            '&:hover': { bgcolor: '#006400' }
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}