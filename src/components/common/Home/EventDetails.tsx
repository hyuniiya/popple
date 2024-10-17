import React from 'react';
import StructuredDescription from '@/components/common/Home/UI/StructuredDescription';
import NaverMap from '@/components/common/Home/NaverMap';
import { EventData } from '@/types';
import { IoMdPin } from 'react-icons/io';

interface EventDetailsProps {
  event: EventData;
  coordinates: { lat: number; lng: number } | null;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, coordinates }) => (
  <div>
    <h1 className="text-xl font-bold text-foreground mt-2">{event.name}</h1>
    <p className="text-sm text-foreground mb-1">
      {event.startDate} - {event.endDate}
    </p>
    <p className="flex items-center text-[12px] text-card-foreground mb-4">
      <IoMdPin className="mr-1" /> {event.location}
    </p>
    <StructuredDescription description={event.description} />
    <div className="mt-8">
      <div className="h-[0.1px] bg-popover-foreground"></div>
      <h2 className="text-xl font-bold my-4">오시는 길</h2>
      {coordinates && (
        <NaverMap
          coordinates={coordinates}
          eventName={event.name}
          eventType={event.type as 'popup' | 'exhibition'}
        />
      )}
    </div>
  </div>
);

export default EventDetails;
