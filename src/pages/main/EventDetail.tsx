import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useEvents from '@/hooks/useEvents';
import { useNaverMap } from '@/hooks/useNaverMap';
import EventImage from '@/components/common/Home/UI/EventImage';
import TabMenu from '@/components/common/Home/UI/TabMenu';
import EventDetails from '@/components/common/Home/EventDetails';
import EventReviews from '@/components/common/Home/EventReviews';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, loading, error } = useEvents();
  const event = events.find(e => e.id === id) || null;
  const coordinates = useNaverMap(event?.location || '');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <EventImage imageUrl={event.imageUrl} name={event.name} />
        <div className="mt-4">
          <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="mt-4">
          {activeTab === 'details' && (
            <EventDetails event={event} coordinates={coordinates} />
          )}
          {activeTab === 'reviews' && <EventReviews event={event} />}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
