import { useNavigate } from 'react-router-dom';
import { EventData } from '@/types';

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {event.imageUrl && (
        <div className="w-full h-48 bg-gray-200">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: 0 }}
            onLoad={e => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EventCard;
