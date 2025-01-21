import React from 'react'
import { Box } from '@mui/material'
import Sidebar from '../components/Sidebar/Index'
import PlayerBar from '../components/Player/Index'

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Sidebar />

      <Box
        sx={{
          overflow: 'hidden',
          padding: 2,
          margin: '10px 10px 10px 0px',
          display: 'flex',
          backgroundColor: '#fff',
          color: '#fcfcff',
          width: '100%',
          borderRadius: '16px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}

        <PlayerBar />
      </Box>
    </Box>
  )
}

export default Layout
