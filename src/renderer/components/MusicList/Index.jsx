import { Box, Typography, Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import imgBg from '../../../../resources/ai-logo.jpg'
import NoDataTimeline from '../no-data-timeline'
import MusicListSkeleton from '../skeletons/music-list'
import { useTimeline } from '../../context/timeline'
import { useUser } from '../../context/user'

export default function MusicList() {
  const { timeline, loading, users } = useTimeline()

  const { user } = useUser()

  const formatTime = (milliseconds) => {
    const date = new Date(milliseconds)
    return date.toISOString().substr(11, 8)
  }

  if (loading) {
    return <MusicListSkeleton />
  } else if (timeline?.length > 0)
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box sx={{ padding: 3, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(41, 42, 51)' }}>
              {user?.role === 'admin'
                ? 'Novada Edremit Avm'
                : user?.role === 'branch'
                  ? `${user?.parent?.name} - ${user?.name}`
                  : user?.role === 'partner'
                    ? `${users[0]?.parent?.name} - ${users[0]?.name}`
                    : null}{' '}
              Canlı Yayını
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

          <Box sx={{ marginTop: 4 }}>
            {timeline.map((song, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Typography
                    color="rgb(205, 211, 221)"
                    fontWeight={600}
                    sx={{ width: '30px', textAlign: 'center' }}
                  >
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </Typography>
                  <Avatar
                    variant="square"
                    sx={{ width: 56, height: 56, backgroundColor: 'transparent' }}
                  >
                    <img
                      src={
                        song?.song?.albums?.cover_url ||
                        song?.stockAd?.cover_url ||
                        song?.specialAd?.cover_url ||
                        imgBg
                      }
                      alt="album cover"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 16,
                        maxHeight: 350
                      }}
                    />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: 'rgb(41, 42, 51)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {song?.[song?.type]?.name}
                    </Typography>
                    <Typography variant="caption" color="rgb(205, 211, 221)">
                      AI Music Bank
                    </Typography>
                  </Box>
                </Box>

                {/* Süre */}
                <Box
                  sx={{
                    width: '150px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1
                  }}
                >
                  <Typography color="rgb(103, 103, 103)" fontSize="12px">
                    {formatTime(song?.startTime)}
                  </Typography>
                  <Typography color="rgb(103, 103, 103)" fontSize="12px">
                    {formatTime(song?.startTime + song?.duration)}
                  </Typography>
                </Box>

                {/* Aksiyon İkonları */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
                    <FavoriteBorderIcon sx={{ fontSize: '13px' }} />
                  </IconButton>
                  <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
                    <MoreVertIcon sx={{ fontSize: '13px' }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    )
  else if (timeline?.length === 0) return <NoDataTimeline />
  else null
}
