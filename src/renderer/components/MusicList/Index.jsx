import React, { useEffect, useState } from 'react'
import { Box, Typography, Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { dayjs } from '../../services/utils/dayjs'
import { TimelineManager } from '../../services/TimelineManager'
import { createClient } from '../../services/supabase/client'
import PlayerBar from '../Player/Index'

const supabase = createClient()

const getStatus = (value, selectedDate) => {
  const isToday = dayjs(selectedDate).isSame(dayjs(), 'day')

  if (!isToday) {
    return 'yayınlanacak'
  }

  const startTimeInMilliseconds = value.startTime
  const durationInMilliseconds = value.duration
  const endTimeInMilliseconds = startTimeInMilliseconds + durationInMilliseconds

  if (
    getCurrentTimeInMilliseconds() >= startTimeInMilliseconds &&
    getCurrentTimeInMilliseconds() <= endTimeInMilliseconds
  ) {
    return 'yayında'
  } else if (getCurrentTimeInMilliseconds() < startTimeInMilliseconds) {
    return 'yayınlanacak'
  } else {
    return 'yayınlandı'
  }
}

const getCurrentTimeInMilliseconds = () => {
  const now = new Date()
  return (
    now.getHours() * 60 * 60 * 1000 +
    now.getMinutes() * 60 * 1000 +
    now.getSeconds() * 1000 +
    now.getMilliseconds()
  )
}

export default function MusicList() {
  const [timeline, setTimeline] = useState([])
  const [filteredTimeline, setFilteredTimeline] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [loading, setLoading] = useState(true)
  const [currentLiveItem, setCurrentLiveItem] = useState(null)

  const formatTime = (milliseconds) => {
    const date = new Date(milliseconds)
    return date.toISOString().substr(11, 8)
  }

  const getTimeline = async () => {
    setLoading(true)
    try {
      const timelineManager = new TimelineManager({
        client: supabase,
        userId: '783916fd-d015-4e37-842c-298c6875a614',
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

  // Şarkı süresi bitince listeyi yenile
  useEffect(() => {
    if (currentLiveItem) {
      const remainingTime =
        currentLiveItem.startTime + currentLiveItem.duration - getCurrentTimeInMilliseconds()

      const timeout = setTimeout(() => {
        getTimeline() // Listeyi yeniden yükle
      }, remainingTime)

      return () => clearTimeout(timeout)
    }
  }, [currentLiveItem])

  useEffect(() => {
    getTimeline()
  }, [])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: '#fff',
          color: '#fcfcff',
          width: 'calc(100vw - 56px)',
          left: '56px',
          position: 'absolute',
          borderRadius: '16px 0px 0px 16px'
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
            <Typography
              variant="h4"
              sx={{ fontFamily: 'Rubik', fontWeight: 600, color: 'rgb(41, 42, 51)' }}
            >
              Canlı Akış
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
            {filteredTimeline.length > 0 ? (
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
                  {/* Şarkı Sırası ve Kapak Resmi */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Typography
                      color="rgb(205, 211, 221)"
                      fontWeight={600}
                      sx={{ width: '30px', textAlign: 'center' }}
                    >
                      0{index + 1}
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
                          `/assets/ai-logo.jpg`
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
      </Box>

      <PlayerBar currentLiveItem={currentLiveItem} />
    </>
  )
}
