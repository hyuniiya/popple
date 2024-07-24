import { useState, useEffect } from 'react';
import { fetchEvents } from '@/api/info';
import { EventData } from '@/types';

interface EventsState {
  events: EventData[];
  loading: boolean;
  error: Error | null;
}

const useEvents = () => {
  const [state, setState] = useState<EventsState>({
    events: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsList = await fetchEvents();
        setState({
          events: eventsList,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState(prevState => ({
          ...prevState,
          loading: false,
          error:
            err instanceof Error ? err : new Error('An unknown error occurred'),
        }));
      }
    };

    loadEvents();
  }, []);

  const currentMonth = new Date().getMonth() + 1;

  const popups = state.events.filter(event => event.type === 'popup');
  const exhibitions = state.events.filter(event => event.type === 'exhibition');

  const thisMonthPopups = popups.filter(popup => {
    const startDate = new Date(popup.startDate);
    return startDate.getMonth() + 1 === currentMonth;
  });

  const thisMonthExhibitions = exhibitions.filter(exhibition => {
    const startDate = new Date(exhibition.startDate);
    return startDate.getMonth() + 1 === currentMonth;
  });

  return {
    ...state,
    popups,
    exhibitions,
    thisMonthPopups,
    thisMonthExhibitions,
  };
};

export default useEvents;
