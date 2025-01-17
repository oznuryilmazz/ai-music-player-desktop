import React, { useEffect, useState } from 'react'
import { Box, IconButton, Typography, Avatar } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { Howl } from 'howler'
import AudioWaveform from '../audio-wave'
import { getCurrentTimeInMilliseconds } from '../../services/utils/timeline'

import imgBg from '../../../../resources/ai-logo.jpg'
import { useTimeline } from '../../context/timeline'

const PlayerBar = () => {
  const [isPlaying, setIsPlaying] = useState(JSON.parse(localStorage.getItem('isPlaying')) || false)
  const [volume, setVolume] = useState(parseFloat(localStorage.getItem('volume')) || 0.2)
  const [soundInstance, setSoundInstance] = useState(null)
  const [currentTime, setCurrentTime] = useState(
    parseFloat(localStorage.getItem('currentTime')) || 0
  )
  const [duration, setDuration] = useState(0)

  const { currentLiveItem, loading } = useTimeline()

  useEffect(() => {
    if (soundInstance && currentLiveItem) {
      soundInstance.stop()
      soundInstance.unload()
      setSoundInstance(null)
    }

    let newSound

    if (currentLiveItem) {
      const now = getCurrentTimeInMilliseconds()
      const elapsedTime = now - currentLiveItem.startTime

      if (elapsedTime > currentLiveItem.duration) {
        setIsPlaying(false)
        setCurrentTime(0)
        return
      }

      newSound = new Howl({
        src: [currentLiveItem.url],
        volume: volume,
        preload: true,
        html5: true,
        buffer: true,
        onload: () => {
          setDuration(newSound.duration() * 1000)
          if (elapsedTime > 0) {
            newSound.seek(elapsedTime / 1000)
          }
          newSound.play()
          setIsPlaying(true)
          requestAnimationFrame(updateCurrentTime)
        },
        onend: () => {
          setIsPlaying(false)
          setCurrentTime(0)
        }
      })

      setSoundInstance(newSound)
    }

    return () => {
      if (newSound) {
        newSound.stop()
        newSound.unload()
      }
    }
  }, [currentLiveItem])

  const handlePlayPause = () => {
    if (soundInstance) {
      if (volume > 0) {
        setVolume(0) // Çalma sırasında sesi sıfırla
      } else {
        setVolume(0.2) // Tekrar başlatıldığında sesi eski seviyeye getir
      }
      setIsPlaying(!isPlaying) // Durum değişikliğini takip et
    }
  }

  useEffect(() => {
    if (soundInstance) {
      soundInstance.volume(volume) // Ses seviyesini anlık olarak güncelle
    }
  }, [volume])

  // useEffect(() => {
  //   if (soundInstance) {
  //     soundInstance.stop()
  //     soundInstance.unload()
  //     setSoundInstance(null)
  //     setIsPlaying(false)
  //   }
  // }, [location])

  useEffect(() => {
    // localStorage'a oynatma durumu kaydet
    localStorage.setItem('isPlaying', JSON.stringify(isPlaying))
    localStorage.setItem('volume', volume.toString())
    localStorage.setItem('currentTime', currentTime.toString())
  }, [isPlaying, volume, currentTime])

  useEffect(() => {
    if (soundInstance) {
      soundInstance.on('play', () => setIsPlaying(true))
      soundInstance.on('pause', () => setIsPlaying(false))
      soundInstance.on('end', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })
    }
  }, [soundInstance])

  const updateCurrentTime = () => {
    if (soundInstance) {
      const currentSeekTime = soundInstance.seek() * 1000
      setCurrentTime(currentSeekTime)
      if (soundInstance.playing()) {
        requestAnimationFrame(updateCurrentTime)
      }
    }
  }

  useEffect(() => {
    let animationFrameId

    const startUpdatingTime = () => {
      if (soundInstance && isPlaying) {
        const update = () => {
          updateCurrentTime()
          animationFrameId = requestAnimationFrame(update)
        }
        update()
      }
    }

    startUpdatingTime()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [soundInstance, isPlaying])

  if (currentLiveItem?.song)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          width: 'fit-content',
          position: 'fixed',
          bottom: 30,
          margin: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            variant="square"
            src={
              currentLiveItem?.song?.albums?.cover_url ||
              currentLiveItem?.stockAd?.cover_url ||
              currentLiveItem?.specialAd?.cover_url ||
              imgBg
            }
            alt="album cover"
            sx={{ width: 56, height: 56 }}
          />
          <Box>
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
              {currentLiveItem?.[currentLiveItem?.type]?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#aaa' }}>
              AI Music Bank
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            margin: '0 16px',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px',
              color: '#fff',
              fontSize: '12px',
              gap: 1
            }}
          >
            <Typography variant="caption">
              {new Date(currentTime).toISOString().substr(14, 5)}
            </Typography>

            <AudioWaveform
              audioUrl={currentLiveItem?.url}
              currentTime={currentTime}
              duration={duration}
            />

            <Typography variant="caption">
              {new Date(duration).toISOString().substr(14, 5)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => handlePlayPause()}>
            {volume > 0 ? (
              <PauseIcon sx={{ color: '#fff', fontSize: '13px' }} />
            ) : (
              <PlayArrowIcon sx={{ color: '#fff', fontSize: '13px' }} />
            )}
          </IconButton>
        </Box>
      </Box>
    )
}

export default PlayerBar
