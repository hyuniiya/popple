import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EventData } from '@/types';
import { useNavigate } from 'react-router-dom';

interface BannerProps {
  events: EventData[];
}

const Banner: React.FC<BannerProps> = ({ events }) => {
  const navigate = useNavigate();
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      pagination={{ clickable: true }}
      navigation
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      className="w-full aspect-[16/9] mb-8 custom-swiper"
    >
      {events.slice(0, 5).map(event => (
        <SwiperSlide
          key={event.id}
          onClick={() => navigate(`/events/${event.id}`)}
          className="relative bg-gray-200"
        >
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: 0 }}
            onLoad={e => {
              e.currentTarget.style.opacity = '1';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h3 className="text-[16px] font-godob">{event.name}</h3>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
