import React, { useMemo } from 'react';
import useEvents from '@/hooks/useEvents';
import Banner from '@/components/common/Home/Banner';
import EventSwiper from '@/components/common/Home/EventSwiper';

const Home: React.FC = () => {
  const { events, loading, error } = useEvents();

  const popups = useMemo(
    () => events.filter(event => event.type === 'popup'),
    [events],
  );
  const exhibitions = useMemo(
    () => events.filter(event => event.type === 'exhibition'),
    [events],
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4">
      <Banner events={events} />

      <div className="mb-8">
        <h2 className="text-2xl font-godob text-primary mb-4">이 달의 팝업</h2>
        <EventSwiper events={popups} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-godob text-primary mb-4">
          이 달의 전시회
        </h2>
        <EventSwiper events={exhibitions} />
      </div>
    </div>
  );
};

export default Home;
