import { createNanoEvents } from 'nanoevents'
import { dayjs } from './utils/dayjs'

function ceilWithStep(start, target, step) {
  return start + Math.ceil((target - start) / step) * step
}

const DAY = 86_400_000

export class TimelineManager {
  #emitter
  #client
  #date
  #userId
  // #songIndex = 0

  #playlists = []

  #adSchedules = []

  #specialAdSchedules = []

  #stockAdSchedules = []

  constructor({ client, date, userId }) {
    this.#emitter = createNanoEvents()
    this.#client = client
    this.#userId = userId
    this.#date = date ?? dayjs().utc(true).valueOf()
  }

  on(event, callback) {
    return this.#emitter.on(event, callback)
  }

  getTimeline() {
    const timeline = []
    const adCounterMap = {}
    const specialAdCounterMap = {}
    const stockAdCounterMap = {}

    this.#adSchedules.forEach((schedule) => {
      adCounterMap[schedule.ad.id] = 1
    })
    this.#specialAdSchedules.forEach((schedule) => {
      specialAdCounterMap[schedule.specialAd.id] = 1
    })

    this.#playlists.forEach((playlist) => {
      if (playlist?.songs.length === 0) return

      this.#adSchedules.forEach((schedule) => {
        if (schedule?.method !== 'exact') adCounterMap[schedule?.ad?.id] = 1
      })
      this.#specialAdSchedules.forEach((schedule) => {
        if (schedule.method !== 'exact') specialAdCounterMap[schedule.specialAd?.id] = 1
      })
      this.#stockAdSchedules.forEach((schedule) => {
        stockAdCounterMap[schedule.stockAd?.id] = 1
      })

      const startTime = playlist?.startTime
      const endTime = playlist?.endTime
      let songIndex = 0

      let currentTime = startTime

      while (currentTime < endTime) {
        const song = playlist?.songs[songIndex]

        const adScheduleQueue = this.#adSchedules
          .filter((schedule) => {
            if (!schedule.interval && adCounterMap[schedule.ad.id] > 1) return false

            if (schedule.method === 'exact') {
              let time = schedule.startTime
              let found = false

              while (time >= currentTime && time < schedule.endTime) {
                if (time < currentTime + song.duration) {
                  found = true
                  break
                }

                if (schedule.interval) time += schedule.interval
                else break
              }

              if (found) return true
            }

            if (currentTime < schedule.startTime || currentTime > schedule.endTime) return false

            return (
              (schedule.interval ?? 0) * adCounterMap[schedule.ad.id] <
              currentTime - Math.max(schedule.startTime, playlist.startTime)
            )
          })
          .sort((a, b) => {
            if (a.method === b.method) return adCounterMap[a.ad.id] - adCounterMap[b.ad.id]
            else if (a.method === 'exact') return -1
            else return 1
          })

        if (adScheduleQueue.length > 0) {
          const schedule = adScheduleQueue[0]
          const fileIndex = adCounterMap[schedule.ad.id] % schedule.ad.files.length

          if (schedule.method === 'exact') {
            const songDuration = schedule.interval
              ? ((schedule.startTime - currentTime) % schedule.interval) + schedule.interval
              : schedule.startTime - currentTime

            if (songDuration > 0) {
              if (songDuration > 300000) console.log(song, schedule)

              timeline.push({
                type: 'song',
                startTime: currentTime,
                duration: songDuration,
                url: song.url,
                song
              })

              currentTime += songDuration
              songIndex = (songIndex + 1) % playlist?.songs.length
            }
          }

          timeline.push({
            type: 'ad',
            startTime: currentTime,
            duration: schedule.ad.files[fileIndex].duration,
            url: schedule.ad.files[fileIndex].url,
            ad: schedule.ad
          })
          adCounterMap[schedule.ad.id]++
          currentTime += schedule.ad.files[fileIndex].duration
        }

        if (currentTime >= endTime) break

        const specialAdScheduleQueue = this.#specialAdSchedules
          .filter((schedule) => {
            if (!schedule.interval) return specialAdCounterMap[schedule.specialAd.id] === 1

            if (schedule.method === 'exact') {
              let time = schedule.startTime
              let found = false

              while (time > currentTime && time < schedule.endTime) {
                if (time < currentTime + song.duration) {
                  found = true
                  break
                }
                time += schedule.interval
              }

              if (found) return true
            }

            if (currentTime < schedule.startTime || currentTime > schedule.endTime) return false

            return (
              schedule.interval * specialAdCounterMap[schedule.specialAd.id] <
              currentTime - Math.max(schedule.startTime, playlist.startTime)
            )
          })
          .sort((a, b) => {
            if (a.method === b.method)
              return specialAdCounterMap[a.specialAd.id] - specialAdCounterMap[b.specialAd.id]
            else if (a.method === 'exact') return -1
            else return 1
          })

        if (specialAdScheduleQueue.length > 0) {
          const schedule = specialAdScheduleQueue[0]
          const fileIndex =
            specialAdCounterMap[schedule.specialAd.id] % schedule.specialAd.files.length

          if (schedule.method === 'exact') {
            const songDuration = schedule.interval
              ? ((schedule.startTime - currentTime) % schedule.interval) + schedule.interval
              : schedule.startTime - currentTime

            if (songDuration < 0) console.log(songDuration)

            timeline.push({
              type: 'song',
              startTime: currentTime,
              duration: songDuration,
              url: song.url,
              song
            })

            currentTime += songDuration
            songIndex = (songIndex + 1) % playlist?.songs?.length
          }

          timeline.push({
            type: 'specialAd',
            startTime: currentTime,
            duration: schedule.specialAd.files[fileIndex].duration,
            url: schedule.specialAd.files[fileIndex].url,
            specialAd: schedule.specialAd
          })
          specialAdCounterMap[schedule.specialAd.id]++
          currentTime += schedule.specialAd.files[fileIndex].duration
        }

        if (currentTime >= endTime) break

        const stockAdScheduleQueue = this.#stockAdSchedules
          .filter((schedule) => {
            if (!schedule.interval) return stockAdCounterMap[schedule.stockAd.id] === 1

            if (currentTime < schedule.startTime || currentTime > schedule.endTime) return false

            return (
              schedule.interval * stockAdCounterMap[schedule.stockAd.id] <
              currentTime - Math.max(schedule.startTime, playlist.startTime)
            )
          })
          .sort((a, b) => {
            return stockAdCounterMap[a.stockAd.id] - stockAdCounterMap[b.stockAd.id]
          })

        if (stockAdScheduleQueue.length > 0) {
          const schedule = stockAdScheduleQueue[0]
          const fileIndex = stockAdCounterMap[schedule.stockAd.id] % schedule.stockAd.files.length

          timeline.push({
            type: 'stockAd',
            startTime: currentTime,
            duration: schedule.stockAd.files[fileIndex].duration,
            url: schedule.stockAd.files[fileIndex].url,
            stockAd: schedule.stockAd
          })
          stockAdCounterMap[schedule.stockAd.id]++
          currentTime += schedule.stockAd.files[fileIndex].duration
        }

        if (currentTime >= endTime) break

        timeline.push({
          type: 'song',
          startTime: currentTime,
          duration: song.duration > endTime - currentTime ? endTime - currentTime : song.duration,
          url: song.url,
          song
        })

        currentTime += song.duration
        songIndex = (songIndex + 1) % playlist?.songs.length
      }
    })

    return { timeline }
  }

  // requestSongChange(index: number) {
  //   this.#emitter.emit('playbackStateChanged', {
  //     action: 'playingSong',
  //     songIndex: index
  //   })
  // }

  // requestPause() {}

  // notifyAudioPlaybackEnd() {}

  async requestUpdate() {
    await Promise.all([
      this.fetchAdSchedules(),
      this.fetchSpecialAdSchedules(),
      this.fetchStockAdSchedules(),
      this.fetchPlaylistSchedules()
    ])
  }

  async fetchPlaylistSchedules() {
    const { data: scheduleData, error: scheduleError } = await this.#client
      .rpc('get_playlist_schedules', {
        p_date: this.#date,
        p_user_id: this.#userId
      })
      .select('*')

    if (scheduleError) return

    this.#playlists = await Promise.all(
      scheduleData.map(async (s) => {
        const { data } = await this.#client
          .rpc('get_playlist_songs_for_date', {
            p_playlist_id: s.playlist_id,
            p_date: this.#date
          })
          .select('*, albums(*)')

        // console.log((dayjs().valueOf() + dayjs().utcOffset() * 60 * 1000) % (DAY))
        // console.log(DateTime.now().toMillis() %  (DAY))>

        // console.log(DateTime.fromObject({ hour: 1 }, { zone: 'utc' }).toSQL())

        return {
          playlistId: s.playlist_id,
          startTime: s.start_time,
          endTime: s.end_time,
          songs: data ?? []
        }
      })
    )

    this.#playlists.sort((a, b) => a.startTime - b.startTime)
  }

  async fetchAdSchedules() {
    const { data, error } = await this.#client
      .rpc('get_ad_schedules', {
        p_date: this.#date,
        p_user_id: this.#userId
      })
      .select('*, ad:ads(*, files(*))')

    if (error) return

    const dateStartAt = this.#date - (this.#date % DAY)
    const dateEndAt = dateStartAt + DAY

    // This type error is not important. :)
    this.#adSchedules = data
      .map((s) => {
        let startTime, endTime

        if (s.start_at < dateStartAt) {
          if (!s.interval) return undefined

          startTime = ceilWithStep(s.start_at, dateStartAt, s.interval) % DAY
        } else startTime = s.start_at % DAY

        if (s.end_at && s.end_at < dateEndAt) endTime = s.end_at % DAY
        else endTime = DAY

        return {
          ad: s.ad,
          startTime,
          endTime,
          method: s.method,
          interval: s.interval ?? undefined
        }
      })
      .filter((s) => !!s)
  }

  async fetchSpecialAdSchedules() {
    const { data, error } = await this.#client
      .rpc('get_special_ad_schedules', {
        p_date: this.#date,
        p_user_id: this.#userId
      })
      .select('*, special_ad:special_ads(*, files(*))')

    if (error) return

    const dateStartAt = this.#date - (this.#date % DAY)
    const dateEndAt = dateStartAt + DAY

    // This type error is not important. :)
    this.#specialAdSchedules = data
      .map((s) => {
        let startTime, endTime

        if (s.start_at < dateStartAt) {
          if (!s.interval) return undefined

          startTime = ceilWithStep(s.start_at, dateStartAt, s.interval) % DAY
        } else startTime = s.start_at % DAY

        if (s.end_at && s.end_at < dateEndAt) endTime = s.end_at % DAY
        else endTime = DAY

        return {
          specialAd: s.special_ad,
          startTime,
          endTime,
          method: s.method,
          interval: s.interval ?? undefined
        }
      })
      .filter((s) => !!s)
  }

  async fetchStockAdSchedules() {
    const { data, error } = await this.#client
      .rpc('get_stock_ad_schedules', {
        p_date: this.#date,
        p_user_id: this.#userId
      })
      .select('*, stock_ad:stock_ads(*, files(*))')

    if (error) return

    const dateStartAt = this.#date - (this.#date % DAY)
    const dateEndAt = dateStartAt + DAY

    // This type error is not important. :)
    this.#stockAdSchedules = data
      .map((s) => {
        let startTime, endTime

        if (s.start_at < dateStartAt) {
          if (!s.interval) return undefined

          startTime = ceilWithStep(s.start_at, dateStartAt, s.interval) % DAY
        } else startTime = s.start_at % DAY

        if (s.end_at && s.end_at < dateEndAt) endTime = s.end_at % DAY
        else endTime = DAY

        return {
          stockAd: s.stock_ad,
          startTime,
          endTime,
          interval: s.interval ?? undefined
        }
      })
      .filter((s) => !!s)
  }

  async fetchTimeline(userId) {
    try {
      const { data, error } = await supabase.rpc('get_playlist_schedules', {
        p_user_id: userId
      })

      if (error) throw error

      // Cache'e kaydet
      await localforage.setItem('timeline', data)
      console.log('Timeline cached successfully:', data)

      return data
    } catch (err) {
      console.warn('Failed to fetch timeline, loading from cache:', err)
      return await this.loadFromCache()
    }
  }

  async loadFromCache() {
    try {
      const cachedData = await localforage.getItem('timeline')
      return cachedData
    } catch (err) {
      console.error('Error fetching cached timeline:', err)
      return null
    }
  }

  // destroy() {}
}
