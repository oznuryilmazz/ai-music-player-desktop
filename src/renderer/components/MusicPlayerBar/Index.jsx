import React from 'react'
import { Box, Typography, IconButton, Slider } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import RepeatIcon from '@mui/icons-material/Repeat'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

const MusicPlayerBar = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 30,
        left: 56,
        right: 0,
        backgroundColor: 'rgb(1 ,14, 50)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img
          src="/images/song-cover.jpg"
          alt="Song Cover"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '4px',
            objectFit: 'cover'
          }}
        />
        <Box>
          <Typography variant="body1" color="white">
            Resistance
          </Typography>
          <Typography variant="body2" color="gray">
            Muse • The Resistance
          </Typography>
        </Box>
        <IconButton>
          <FavoriteBorderIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>

      {/* Center: Player Controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <IconButton>
            <ShuffleIcon sx={{ color: 'white' }} />
          </IconButton>
          <IconButton>
            <SkipPreviousIcon sx={{ color: 'white' }} />
          </IconButton>
          <IconButton
            sx={{
              width: '50px',
              height: '50px',
              backgroundColor: '#4a4a65',
              '&:hover': { backgroundColor: '#626284' }
            }}
          >
            <PlayArrowIcon sx={{ color: 'white' }} />
          </IconButton>
          <IconButton>
            <SkipNextIcon sx={{ color: 'white' }} />
          </IconButton>
          <IconButton>
            <RepeatIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '400px' }}>
          <Typography variant="body2" color="white">
            2:24
          </Typography>
          <Slider
            defaultValue={30}
            sx={{
              color: 'white',
              '& .MuiSlider-thumb': {
                backgroundColor: 'white'
              }
            }}
          />
          <Typography variant="body2" color="white">
            5:46
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <IconButton>
          <VolumeUpIcon sx={{ color: 'white' }} />
        </IconButton>
        <Slider
          defaultValue={50}
          sx={{
            width: '100px',
            color: 'white',
            '& .MuiSlider-thumb': {
              backgroundColor: 'white'
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default MusicPlayerBar
