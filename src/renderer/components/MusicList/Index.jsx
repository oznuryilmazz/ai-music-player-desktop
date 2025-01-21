import { Box, Typography, Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import imgBg from '../../../../resources/ai-logo.jpg'
import NoDataTimeline from '../no-data-timeline'
import MusicListSkeleton from '../skeletons/music-list'
import { formatTime } from '../../services/utils/format-date'

export default function MusicList({
  timeline,
  loading,
  title = 'Canlı Yayın Akışı',
  height,
  show = true
}) {
  if (loading) {
    return <MusicListSkeleton count={show ? 15 : 3} />
  } else
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
        <Box sx={{ padding: '0px 12px', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2
            }}
          >
            <Typography fontSize={16} sx={{ fontWeight: 700, color: 'rgb(41, 42, 51)' }}>
              {title}
            </Typography>
            {show && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
                  <SearchIcon />
                </IconButton>
                <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
                  <NotificationsIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          {timeline.length > 0 ? (
            <Box sx={{ marginTop: 2, height: height, overflowY: 'auto', overflowX: 'hidden' }}>
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
                    {show && (
                      <Typography
                        color="rgb(205, 211, 221)"
                        fontWeight={600}
                        sx={{ width: '20px', textAlign: 'center' }}
                      >
                        {index < 9 ? `0${index + 1}` : index + 1}
                      </Typography>
                    )}
                    <Avatar
                      variant="square"
                      sx={{ width: 54, height: 54, backgroundColor: 'transparent' }}
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
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: 'rgb(41, 42, 51)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '14px'
                        }}
                      >
                        {song?.[song?.type]?.name}
                      </Typography>
                      <Typography variant="caption" color="rgb(170, 170, 170)" fontSize={12}>
                        AI Music Bank
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: '450px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      gap: 1
                    }}
                  >
                    <Typography color="rgb(41, 42, 51)" fontSize="12px" fontWeight={600}>
                      {formatTime(song?.startTime)}
                    </Typography>
                    <Typography color="rgb(103, 103, 103)" fontSize="12px">
                      {formatTime(song?.startTime + song?.duration)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {show && (
                      <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
                        <FavoriteBorderIcon sx={{ fontSize: '16px' }} />
                      </IconButton>
                    )}
                    <IconButton sx={{ color: 'rgb(41, 42, 51)' }}>
                      <MoreVertIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="rgba(41, 42, 51,70)">
              Herhangi bir içerik kayıt edilememiştir.
            </Typography>
          )}
        </Box>
      </Box>
    )
}
