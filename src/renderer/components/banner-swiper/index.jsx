import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import './styles.css'

import { Pagination, Mousewheel, Autoplay } from 'swiper/modules'

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
        autoplay={{
          delay: 10000,
          disableOnInteraction: false
        }}
        modules={[Mousewheel, Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <a href="https://aimusic.com.tr" target="_blank" rel="noreferrer">
            <img
              loading="lazy"
              src={instagramBanner}
              alt="Instagram Banner"
              height={290}
              className="bannerImage"
            />
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="https://www.instagram.com/aimusic.business/" target="_blank" rel="noreferrer">
            <img
              loading="lazy"
              src={muzikYayiniBanner}
              alt="Müzik Yayını Banner"
              height={290}
              className="bannerImage"
            />
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="https://aimusic.com.tr" target="_blank" rel="noreferrer">
            <img
              loading="lazy"
              src={havaDurumuBanner}
              alt="Hava Durumu Banner"
              height={290}
              className="bannerImage"
            />
          </a>
        </SwiperSlide>
      </Swiper>
    </Box>
  )
}
