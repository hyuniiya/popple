import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/api/firebase';

export interface Event {
  id: string;
  name: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  type: string;
  imageUrl: string;
  operatingHours: string;
}

const useEventList = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const querySnapshot = await getDocs(eventsRef);
        const events: Event[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, 'id'>),
        }));
        setAllEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error as Error);
      }
    };

    fetchAllEvents();
  }, []);

  return { allEvents, error };
};

export default useEventList;
