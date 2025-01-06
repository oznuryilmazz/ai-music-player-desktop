import React, { useEffect, useState } from 'react'
import { Box, Typography, Avatar, IconButton, Skeleton, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import dayjs from 'dayjs'

import imgBg from '../../../../resources/ai-logo.jpg'
import { TimelineManager } from '../../services/TimelineManager'
import { supabase } from '../../services/supabase/client'
import PlayerBar from '../Player/Index'
import { useUser } from '../../context/user'
import { listUser } from '../../../api/users'
import { getCurrentTimeInMilliseconds, getStatus } from '../../services/utils/timeline'

export default function MusicList() {
  const [timeline, setTimeline] = useState([])
  const [filteredTimeline, setFilteredTimeline] = useState([])
  const [users, setUsers] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [loading, setLoading] = useState(true)
  const [currentLiveItem, setCurrentLiveItem] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      const data = await listUser()
      console.log(
        'data',
        data?.data.filter((user) => user.role === 'branch')
      )
      setUsers(data?.data.filter((user) => user.role === 'branch'))
    }

    fetchData()
  }, [])

  const formatTime = (milliseconds) => {
    const date = new Date(milliseconds)
    return date.toISOString().substr(11, 8)
  }

  const getTimeline = async () => {
    setLoading(true)
    try {
      const timelineManager = new TimelineManager({
        client: supabase,
        userId:
          user?.role === 'admin'
            ? '783916fd-d015-4e37-842c-298c6875a614'
            : user?.role === 'branch'
              ? user?.id
              : user?.role === 'partner'
                ? users[0]?.id
                : null,
        date: dayjs(selectedDate).utc(true).valueOf()
      })
      await timelineManager.requestUpdate()

      const { timeline } = timelineManager.getTimeline()

      const filteredTimeline = timeline.filter(
        (value) => getStatus(value, selectedDate) !== 'yayınlandı'
      )

      setTimeline(filteredTimeline)
      setFilteredTimeline(filteredTimeline)

      const liveItem = filteredTimeline.find((item) => getStatus(item, selectedDate) === 'yayında')
      setCurrentLiveItem(liveItem || null)
    } catch (error) {
      console.error('Error fetching timeline:', error)
    } finally {
      setLoading(false)
    }
  }

  console.log('users', users)

  useEffect(() => {
    if (currentLiveItem) {
      const remainingTime =
        currentLiveItem.startTime + currentLiveItem.duration - getCurrentTimeInMilliseconds()

      const timeout = setTimeout(() => {
        const currentIndex = timeline.findIndex(
          (item) => item.startTime === currentLiveItem.startTime
        )

        if (currentIndex + 1 < timeline.length) {
          setCurrentLiveItem(timeline[currentIndex + 1]) // Bir sonraki şarkıya geçiş
        } else {
          setCurrentLiveItem(null) // Liste sonuna ulaşıldığında
        }
      }, remainingTime)

      return () => clearTimeout(timeout)
    }
  }, [currentLiveItem, timeline])

  useEffect(() => {
    getTimeline()
  }, [selectedDate, users])

  return timeline.length > 0 ? (
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
        {/* Header */}
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
          {loading ? (
            // Skeleton Loader
            Array.from(new Array(5)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 2
                }}
              >
                <Skeleton variant="text" width={30} />
                <Skeleton variant="rectangular" width={56} height={56} />
                <Box sx={{ flex: 1, marginLeft: 2 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Box>
            ))
          ) : filteredTimeline.length > 0 ? (
            filteredTimeline.map((song, index) => (
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
            ))
          ) : (
            <Typography>No data available</Typography>
          )}
        </Box>
      </Box>

      <PlayerBar currentLiveItem={currentLiveItem} />
    </Box>
  ) : (
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
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 2
        }}
      >
        🎶🎧 Henüz bir timeline tanımlanmamış! Burada yakında müzik dolu listelerinizi
        görebileceksiniz! 🎸🎷
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
