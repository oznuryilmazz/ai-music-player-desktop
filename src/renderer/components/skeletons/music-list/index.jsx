import { Box, Skeleton } from '@mui/material'

export default function MusicListSkeleton() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3
      }}
    >
      {Array.from(new Array(15)).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            gap: 2
          }}
        >
          <Skeleton variant="text" width={30} />
          <Skeleton variant="rectangular" width={56} height={56} />
          <Box sx={{ flex: 1, marginLeft: 2 }}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Box>
      ))}
    </Box>
  )
}
