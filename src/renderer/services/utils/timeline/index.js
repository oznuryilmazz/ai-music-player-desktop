import dayjs from 'dayjs'

export const getCurrentTimeInMilliseconds = () => {
  const now = new Date()
  return (
    now.getHours() * 60 * 60 * 1000 +
    now.getMinutes() * 60 * 1000 +
    now.getSeconds() * 1000 +
    now.getMilliseconds()
  )
}

export const getStatus = (value, selectedDate) => {
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
