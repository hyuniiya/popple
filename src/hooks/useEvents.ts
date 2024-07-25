import { useState, useEffect, useMemo } from 'react';
import { fetchEvents } from '@/api/info';
import { EventData } from '@/types';

interface EventWithStatus extends EventData {
  status: 'ongoing' | 'ended';
}

interface EventsState {
  events: EventWithStatus[];
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
        const currentDate = new Date();
        const eventsWithStatus = eventsList.map(event => ({
          ...event,
          status:
            new Date(event.endDate) < currentDate
              ? ('ended' as const)
              : ('ongoing' as const),
        }));
        setState({
          events: eventsWithStatus,
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

  const popups = useMemo(
    () => state.events.filter(event => event.type === 'popup'),
    [state.events],
  );
  const exhibitions = useMemo(
    () => state.events.filter(event => event.type === 'exhibition'),
    [state.events],
  );

  const thisMonthPopups = useMemo(
    () =>
      popups.filter(popup => {
        const startDate = new Date(popup.startDate);
        return startDate.getMonth() + 1 === currentMonth;
      }),
    [popups, currentMonth],
  );

  const thisMonthExhibitions = useMemo(
    () =>
      exhibitions.filter(exhibition => {
        const startDate = new Date(exhibition.startDate);
        return startDate.getMonth() + 1 === currentMonth;
      }),
    [exhibitions, currentMonth],
  );

  const ongoingEvents = useMemo(
    () => state.events.filter(event => event.status === 'ongoing'),
    [state.events],
  );
  const endedEvents = useMemo(
    () => state.events.filter(event => event.status === 'ended'),
    [state.events],
  );

  return {
    ...state,
    popups,
    exhibitions,
    thisMonthPopups,
    thisMonthExhibitions,
    ongoingEvents,
    endedEvents,
  };
};

export default useEvents;
