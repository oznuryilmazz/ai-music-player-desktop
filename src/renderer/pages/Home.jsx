import { Box } from '@mui/material'
import React from 'react'
import Sidebar from '../components/Sidebar'
import MusicList from '../components/MusicList/Index'

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Sidebar />

      <MusicList />

    </Box>
  )
}

export default Home
