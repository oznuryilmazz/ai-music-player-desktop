import { forwardRef } from 'react'

import { Box } from '@mui/material'

import aiAmblem from '../../../../resources/amblem-ai.png'

const Logo = forwardRef(({ disabledLink = false, width, sx, ...other }, ref) => {
  const logo = <img loading="lazy" src={aiAmblem} alt="ai music yazılım as" width={width} />

  if (disabledLink) {
    return logo
  }

  return logo
})

Logo.displayName = 'Logo'

export default Logo
