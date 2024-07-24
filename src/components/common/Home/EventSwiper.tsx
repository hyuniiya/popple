import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { EventData } from '@/types';
import EventCard from './EventCard';

interface EventSwiperProps {
  events: EventData[];
}

const EventSwiper: React.FC<EventSwiperProps> = ({ events }) => (
  <Swiper
    modules={[Navigation]}
    navigation
    spaceBetween={20}
    slidesPerView={2}
    className="custom-swiper"
  >
    {events.map(event => (
      <SwiperSlide key={event.id}>
        <EventCard event={event} />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default EventSwiper;
