import * as React from 'react'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { Stack, Typography } from '@mui/material'
import mini1 from '../../../../resources/banner/mini-1.webp'
import mini2 from '../../../../resources/banner/app-mini-banner-04.png'
import mini3 from '../../../../resources/banner/mini-2.webp'
import mini4 from '../../../../resources/banner/mini-3.jpeg'

const newsItems = [
  {
    image: mini1,
    title: 'Stok Sihirbazı',
    description: 'Stok Sihirbazı ile satışlarınızı artırın ve envanterinizi akıllıca yönetin.',
    link: 'https://aimusic.com.tr/stok-sihirbazi'
  },
  {
    image: mini2,
    title: 'HarmoniGram',
    description: 'İşletmenizde Müzik ve Görselliğin Buluşması',
    link: 'https://aimusic.com.tr/harmonigram'
  },
  {
    image: mini3,
    title: 'Ai Music Box',
    description: 'Teknoloji ve müziği bir araya getirir',
    link: 'https://aimusic.com.tr/ai-music-box/?swcfpc=1'
  },
  {
    image: mini4,
    title: 'MoodEye',
    description: 'Müzik, artık sizi gerçekten anlayacak.',
    link: ''
  }
]

export default function News() {
  return (
    <Box sx={{ padding: '0px 12px', width: '100%' }}>
      <Typography fontSize={16} sx={{ fontWeight: 700, color: 'rgb(41, 42, 51)', marginBottom: 2 }}>
        Haberler
      </Typography>

      <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
        {newsItems.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            sx={{ display: 'flex', flexDirection: 'column' }}
            key={index}
          >
            <a
              href={item?.link}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: '100%',
                  objectFit: 'cover',
                  height: '140px',
                  borderRadius: 4
                }}
              />
              <Stack marginTop={1}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: 'rgb(41, 42, 51)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '14px'
                  }}
                >
                  {item.title}
                </Typography>
                <Typography fontSize={11} color="rgb(41, 42, 51)">
                  {item.description}
                </Typography>
              </Stack>
            </a>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
