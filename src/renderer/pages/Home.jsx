import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import MusicList from '../components/MusicList/Index'
import BannerSwiper from '../components/banner-swiper'
import { useTimeline } from '../context/timeline'
import { useUser } from '../context/user'

import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import News from '../components/news'

const Home = () => {
  const { users, timeline, loading } = useTimeline()

  const { user } = useUser()

  return (
    <Box width="100%">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 1,
          marginBottom: 1
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(41, 42, 51)' }}>
          {user?.role === 'admin'
            ? 'Novada Edremit Avm'
            : user?.role === 'branch'
              ? `${user?.name}`
              : user?.role === 'partner'
                ? `${users[0]?.name}`
                : null}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
            <SearchIcon />
          </IconButton>
          <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" gap={1} width="100%">
        <Box display="flex" flexDirection="column" gap={3} width="70%">
          <BannerSwiper />

          <MusicList timeline={timeline} loading={loading} height="350px" />
        </Box>

        <Box display="flex" flexDirection="column" gap={1} width="30%">
          <MusicList
            timeline={timeline.filter((x) => x.type === 'ad').splice(0, 3)}
            loading={loading}
            height="220px"
            show={false}
            title="Reklamlarınız"
          />
          <News />
        </Box>
      </Box>
    </Box>
  )
}

export default Home
