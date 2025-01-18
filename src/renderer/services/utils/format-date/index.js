export const formatTime = (milliseconds) => {
  const date = new Date(milliseconds)
  return date.toISOString().substr(11, 8)
}
