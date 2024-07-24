import React from 'react';
import { EventData } from '@/types';

interface EventReviewsProps {
  event: EventData;
}

const EventReviews: React.FC<EventReviewsProps> = () => {
  return (
    <div>
      <p>아직 후기가 없습니다.</p>
    </div>
  );
};

export default EventReviews;
