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
  const [userId, setUserId] = useState(null)
  const { user } = useUser()

  console.log('userId', userId)

  useEffect(() => {
    const initializeUser = async () => {
      if (user?.role === 'admin') {
        setUserId('783916fd-d015-4e37-842c-298c6875a614')
      } else if (user?.role === 'branch') {
        setUserId(user?.id)
      } else if (user?.role === 'partner') {
        try {
          setLoading(true)
          const response = await listUser()
          if (response?.data) {
            const filteredUsers = response.data.filter((user) => user.role === 'branch')
            setUsers(filteredUsers)
            if (filteredUsers.length > 0) {
              setUserId(filteredUsers[0]?.id)
            }
          }
        } catch (error) {
          console.error('Error fetching users:', error)
        }
      }
    }

    initializeUser()
  }, [user])

  const getTimeline = async (userId) => {
    setLoading(true)
    try {
      const timelineManager = new TimelineManager({
        client: supabase,
        userId,
        date: dayjs(selectedDate).utc(true).valueOf()
      })

      await timelineManager.requestUpdate()
      const { timeline: updatedTimeline } = timelineManager.getTimeline()

      const filteredTimeline = updatedTimeline.filter(
        (item) => getStatus(item, selectedDate) !== 'yayınlandı'
      )

      setTimeline(filteredTimeline)
      setCurrentLiveItem(
        filteredTimeline.find((item) => getStatus(item, selectedDate) === 'yayında') || null
      )
    } catch (error) {
      console.error('Error fetching timeline:', error)
    } finally {
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
            setTimeline(timeline.filter((item) => getStatus(item, selectedDate) === 'yayınlanacak'))
          }
        }, remainingTime)

        return () => clearTimeout(timeout)
      }
    }
  }, [timeline, selectedDate])

  useEffect(() => {
    if (userId) getTimeline(userId)
  }, [selectedDate, userId])

  console.log('timeline', timeline)
  return (
    <TimelineContext.Provider
      value={{
        timeline,
        currentLiveItem,
        setTimeline,
        setCurrentLiveItem,
        setUserId,
        users,
        loading
      }}
    >
      {children}
    </TimelineContext.Provider>
  )
}

export const useTimeline = () => useContext(TimelineContext)
