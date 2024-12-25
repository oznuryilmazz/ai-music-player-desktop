import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const ComingSoonPage = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'black'
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          fontSize: '3rem',
          mb: 2
        }}
      >
        Çok Yakında
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: '300',
          fontSize: '1.2rem',
          mb: 4
        }}
      >
        Yeni deneyimler ve fırsatlarla geliyoruz! Bizi takipte kalın.
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          borderRadius: '30px',
          padding: '10px 30px',
          fontSize: '1rem',
          fontWeight: 'bold',
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
          }
        }}
        onClick={() => {
          alert('Takipte kalın!')
        }}
      >
        Takipte Kalın
      </Button>
    </Box>
  )
}

export default ComingSoonPage
