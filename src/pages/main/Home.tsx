import React, { useMemo } from 'react';
import useEvents from '@/hooks/useEvents';
import Banner from '@/components/common/Home/Banner';
import EventSwiper from '@/components/common/Home/EventSwiper';

const Home: React.FC = () => {
  const { loading, events, error } = useEvents();

  const popups = useMemo(
    () => events.filter(event => event.type === 'popup'),
    [events],
  );
  const exhibitions = useMemo(
    () => events.filter(event => event.type === 'exhibition'),
    [events],
  );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4">
      {loading ? (
        <>
          <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
          <div className="mb-8">
            <div className="h-8 bg-gray-200 w-1/4 rounded animate-pulse mb-4" />
            <EventSwiper events={[]} loading={true} />
          </div>
          <div className="mb-8">
            <div className="h-8 bg-gray-200 w-1/4 rounded animate-pulse mb-4" />
            <EventSwiper events={[]} loading={true} />
          </div>
        </>
      ) : (
        <>
          <Banner events={events} />

          <div className="mb-8">
            <h2 className="text-2xl font-godob text-primary mb-4">
              이 달의 팝업
            </h2>
            <EventSwiper events={popups} loading={false} />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-godob text-primary mb-4">
              이 달의 전시회
            </h2>
            <EventSwiper events={exhibitions} loading={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
