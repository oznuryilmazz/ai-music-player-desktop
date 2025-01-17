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
        height: '100vh'
      }}
    >
      <Sidebar />

      <Box
        sx={{
          overflowY: 'auto',
          padding: 2,
          display: 'flex',
          height: '100vh',
          backgroundColor: '#fff',
          color: '#fcfcff',
          width: '100%',
          borderRadius: '16px 0px 0px 16px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'stretch'
        }}
      >
        {children}

        <PlayerBar />
      </Box>
    </Box>
  )
}

export default Layout
