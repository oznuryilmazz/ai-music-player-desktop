import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import './styles.css'

import { Pagination, Mousewheel } from 'swiper/modules'

import instagramBanner from '../../../../resources/banner/1.png'
import muzikYayiniBanner from '../../../../resources/banner/2.png'
import havaDurumuBanner from '../../../../resources/banner/3.png'
import { Box } from '@mui/material'

export default function BannerSwiper() {
  return (
    <Box>
      <Swiper
        direction={'vertical'}
        pagination={{
          clickable: true
        }}
        mousewheel={true}
        modules={[Mousewheel, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src={instagramBanner}
            alt="Instagram Banner"
            height={290}
            style={{ objectFit: 'none' }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={muzikYayiniBanner}
            alt="Müzik Yayını Banner"
            height={290}
            style={{ objectFit: 'none' }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={havaDurumuBanner}
            alt="Hava Durumu Banner"
            height={290}
            style={{ objectFit: 'none' }}
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  )
}
