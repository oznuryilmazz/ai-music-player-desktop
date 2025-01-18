import React, { useRef, useEffect, useMemo } from 'react'

const AudioWaveform = ({ audioUrl, currentTime, duration }) => {
  const canvasRef = useRef(null)
  const waveformDataRef = useRef([]) // Waveform verilerini saklamak için useRef kullanıyoruz

  // Audio verisini getirme ve işleme işlemini optimize et
  const waveformData = useMemo(() => {
    const fetchWaveformData = async () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Tüm şarkının genlik verilerini al
      const rawData = audioBuffer.getChannelData(0) // Sol kanal
      const samples = 2000 // Çizilecek örnek sayısı
      const blockSize = Math.floor(rawData.length / samples) // Her bloktaki veri
      const waveformData = []

      for (let i = 0; i < samples; i++) {
        const blockStart = i * blockSize
        let sum = 0
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]) // Genliklerin mutlak toplamı
        }
        waveformData.push(sum / blockSize) // Ortalamayı hesapla
      }

      return waveformData
    }

    // Veriyi yalnızca `audioUrl` değiştiğinde getir
    fetchWaveformData().then((data) => {
      waveformDataRef.current = data
    })
  }, [audioUrl])

  useEffect(() => {
    const drawWaveform = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      const waveformData = waveformDataRef.current
      if (!waveformData || waveformData.length === 0) return

      const barWidth = width / 100 // Zoom: 100 çubuğu gösteriyoruz
      const zoomWindowSize = Math.floor(waveformData.length / 20) // Zoom penceresi

      const render = () => {
        ctx.clearRect(0, 0, width, height)

        const progress = currentTime / duration || 0 // İlerleme yüzdesi
        const currentIndex = Math.floor(progress * waveformData.length) // Mevcut konum
        const startIndex = Math.max(0, currentIndex - zoomWindowSize / 2) // Zoom başlangıcı
        const endIndex = Math.min(waveformData.length, startIndex + zoomWindowSize) // Zoom bitişi

        for (let i = startIndex; i < endIndex; i++) {
          const value = waveformData[i]
          const barHeight = value * height
          const x = (i - startIndex) * barWidth
          const y = height / 2 - barHeight / 2

          // Renk değişimi: İlerleme yüzdesine göre turuncuya dönüş
          ctx.fillStyle = i < currentIndex ? '#23bff4' : '#FFFFFF'
          ctx.fillRect(x, y, barWidth - 1, barHeight)
        }

        requestAnimationFrame(render)
      }

      render()
    }

    drawWaveform() // Waveform çizimini başlat
  }, [currentTime, duration]) // currentTime ve duration değiştikçe yeniden çizim yapar

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '500px',
        height: '75px'
      }}
    />
  )
}

export default AudioWaveform
