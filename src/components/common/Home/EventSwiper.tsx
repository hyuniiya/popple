import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { EventData } from '@/types';
import EventCard from './EventCard';

interface EventSwiperProps {
  events: EventData[];
  loading: boolean;
}

const EventSwiper: React.FC<EventSwiperProps> = ({ events, loading }) => (
  <Swiper
    modules={[Navigation]}
    navigation
    spaceBetween={20}
    slidesPerView={2}
    className="custom-swiper"
  >
    {loading
      ? Array.from({ length: 4 }).map((_, index) => (
          <SwiperSlide key={index}>
            <EventCard event={{} as EventData} loading={true} />
          </SwiperSlide>
        ))
      : events.map(event => (
          <SwiperSlide key={event.id}>
            <EventCard event={event} />
          </SwiperSlide>
        ))}
  </Swiper>
);

export default EventSwiper;
