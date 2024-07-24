import React from 'react';
import { IoMdPin } from 'react-icons/io';
import { EventData } from '@/types';

interface EventInfoProps {
  event: EventData;
}

const EventInfo: React.FC<EventInfoProps> = ({ event }) => (
  <div className="mb-8">
    <h1 className="text-[20px] font-bold mt-4 text-foreground">{event.name}</h1>
    <p className="text-[13px] text-foreground">
      {event.startDate} - {event.endDate}
    </p>
    <p className="flex items-center text-[11px] text-popover">
      <IoMdPin /> {event.location}
    </p>
  </div>
);

export default EventInfo;
