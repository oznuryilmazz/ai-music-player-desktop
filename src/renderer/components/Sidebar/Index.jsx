import React from 'react'
import { Box, Divider, IconButton, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'

import logo from '../../../../resources/amblem-ai.png'
import { useUser } from '../../context/user'
import { createClient } from '../../services/supabase/client'

const Sidebar = () => {
  const navigate = useNavigate()
  const { user, setUser } = useUser()
  const supabase = createClient()

  console.log('user', user)

  const handleNavigation = (route) => {
    navigate(route)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error.message)
    }
  }

  return (
    <Box
      sx={{
        width: '56px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 0'
      }}
    >
      <Box>
        <IconButton onClick={() => handleNavigation('/login')} title="Account">
          <img src={logo} alt="Amblem AI" style={{ width: '70%' }} />
        </IconButton>
      </Box>

      <Stack spacing={2} alignItems="center">
        <IconButton onClick={() => handleNavigation('/')} title="Home">
          <HomeIcon sx={{ fontSize: '18px', color: '#ffffff' }} />
        </IconButton>
        <IconButton onClick={() => handleNavigation('/music')} title="Music">
          <MusicNoteIcon sx={{ fontSize: '18px', color: '#ffffff' }} />
        </IconButton>
        <Divider sx={{ width: '70%', bgcolor: '#ffffff40' }} />
        <IconButton onClick={() => handleNavigation('/favorites')} title="Favorites">
          <FavoriteIcon sx={{ fontSize: '18px', color: '#ffffff' }} />
        </IconButton>
        <IconButton onClick={() => handleNavigation('/library')} title="Library">
          <LibraryMusicIcon sx={{ fontSize: '18px', color: '#ffffff' }} />
        </IconButton>
        <IconButton onClick={() => handleNavigation('/settings')} title="Settings">
          <SettingsIcon sx={{ fontSize: '18px', color: '#ffffff' }} />
        </IconButton>
      </Stack>

      <Box>
        <IconButton
          onClick={() => (user?.id ? handleLogout() : handleNavigation('/login'))}
          title="Account"
        >
          {user?.id ? (
            <LogoutIcon sx={{ fontSize: '18px', color: '#d8d8f6' }} />
          ) : (
            <AccountCircleIcon sx={{ fontSize: '18px', color: '#d8d8f6' }} />
          )}
        </IconButton>
      </Box>
    </Box>
  )
}

export default Sidebar
