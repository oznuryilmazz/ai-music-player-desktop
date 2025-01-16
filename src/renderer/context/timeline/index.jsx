import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '../../services/supabase/client'

import dayjs from 'dayjs'

import { TimelineManager } from '../../services/TimelineManager'
import { listUser } from '../../../api/users'
import { getCurrentTimeInMilliseconds, getStatus } from '../../services/utils/timeline'
import { useUser } from '../user'

const TimelineContext = createContext()

export const TimelineProvider = ({ children }) => {
  const [timeline, setTimeline] = useState([])
  const [users, setUsers] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [loading, setLoading] = useState(true)
  const [currentLiveItem, setCurrentLiveItem] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      const data = await listUser()
      setUsers(data?.data.filter((user) => user.role === 'branch'))
    }

    fetchData()
  }, [])

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

      setCurrentLiveItem(
        filteredTimeline.find((item) => getStatus(item, selectedDate) === 'yayında') || null
      )
    } catch (error) {
      console.error('Error fetching timeline:', error)
    } finally {
      console.log('timeline', timeline)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (timeline.length > 0) {
      const currentIndex = timeline.findIndex((item) => getStatus(item, selectedDate) === 'yayında')

      if (currentIndex !== -1) {
        const currentSong = timeline[currentIndex]

        setCurrentLiveItem(currentSong)
        const remainingTime =
          currentSong.startTime + currentSong.duration - getCurrentTimeInMilliseconds()

        const timeout = setTimeout(() => {
          const nextIndex = currentIndex + 1

          if (nextIndex < timeline.length) {
            const updatedTimeline = timeline.filter((item, index) => {
              const status = getStatus(item, selectedDate)
              return status === 'yayında' || (status === 'yayınlanacak' && index > currentIndex)
            })

            setTimeline(updatedTimeline)
          } else {
            const finalTimeline = timeline.filter(
              (item) => getStatus(item, selectedDate) === 'yayınlanacak'
            )
            setTimeline(finalTimeline)
          }
        }, remainingTime)

        return () => clearTimeout(timeout)
      }
    }
  }, [timeline, selectedDate])

  useEffect(() => {
    getTimeline()
  }, [selectedDate, users, user])

  return (
    <TimelineContext.Provider value={{ timeline, currentLiveItem, users, loading }}>
      {children}
    </TimelineContext.Provider>
  )
}

export const useTimeline = () => useContext(TimelineContext)
