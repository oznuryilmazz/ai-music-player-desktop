import React, { useRef, useEffect, useState } from 'react'
import { Box, IconButton, Typography, Avatar } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { Howl } from 'howler'

export const getCurrentTimeInMilliseconds = () => {
  const now = new Date()
  return (
    now.getHours() * 60 * 60 * 1000 +
    now.getMinutes() * 60 * 1000 +
    now.getSeconds() * 1000 +
    now.getMilliseconds()
  )
}

const PlayerBar = ({ currentLiveItem }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.2)
  const [soundInstance, setSoundInstance] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

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
        newSound.unload() // Temizleme eklenmiş
      }
    }
  }, [currentLiveItem])

  useEffect(() => {
    if (soundInstance) {
      soundInstance.volume(volume)
    }
  }, [volume])

  const handlePlayPause = () => {
    if (soundInstance) {
      if (isPlaying) {
        soundInstance.pause()
      } else {
        soundInstance.play()
      }
    }
  }

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

  console.log('isPlaying', isPlaying)

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue)
  }

  const updateCurrentTime = () => {
    if (soundInstance) {
      const currentSeekTime = soundInstance.seek() * 1000
      setCurrentTime(currentSeekTime)

      if (soundInstance.playing()) {
        requestAnimationFrame(updateCurrentTime)
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '16px',
        width: '900px',
        position: 'absolute',
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
            `/assets/ai-logo.jpg`
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
            marginTop: '8px',
            color: '#fff',
            fontSize: '12px',
            gap: 1
          }}
        >
          <Typography variant="caption">
            {new Date(currentTime).toISOString().substr(14, 5)}
          </Typography>
          {/* <div ref={waveformRef} style={{ width: '100%' }} /> */}
          <Typography variant="caption">
            {new Date(duration).toISOString().substr(14, 5)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => handlePlayPause()}>
          {isPlaying ? (
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
