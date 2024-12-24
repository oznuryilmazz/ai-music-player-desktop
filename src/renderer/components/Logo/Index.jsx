import { forwardRef } from 'react'

import { Box } from '@mui/material'

import aiAmblem from '../../../../resources/amblem-ai.png'

const Logo = forwardRef(({ disabledLink = false, width, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        display: 'inline-flex',
        ...sx
      }}
      {...other}
    >
      <img src={aiAmblem} alt="ai music yazılım as" width={width} />
    </Box>
  )

  if (disabledLink) {
    return logo
  }

  return (
    <a href={'/'} sx={{ display: 'contents' }}>
      {logo}
    </a>
  )
})

Logo.displayName = 'Logo'

export default Logo
