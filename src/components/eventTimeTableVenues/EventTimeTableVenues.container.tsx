import { useEffect, useRef, useState } from "react";
import { startOfDay, format } from "date-fns";
import EventTimeTableVenuesPresenter from "./EventTimeTableVenues.presenter";
import type { TEventItem, TVenue } from "./EventTimeTableVenues.schema";

const LOCAL_VENUES = "ett_venues_v3";
const LOCAL_EVENTS = "ett_events_v3";
const uid = () => Math.random().toString(36).slice(2);

export default function EventTimeTableVenuesContainer() {
  const today = startOfDay(new Date());

  const [venues] = useState<TVenue[]>(() => {
    const raw = localStorage.getItem(LOCAL_VENUES);
    if (raw) return JSON.parse(raw);

    const sample = [
      { id: uid(), name: "Venue1" },
      { id: uid(), name: "Venue2" },
      { id: uid(), name: "Venue3" },
    ];

    localStorage.setItem(LOCAL_VENUES, JSON.stringify(sample));
    return sample;
  });

  const [events] = useState<TEventItem[]>(() => {
    const raw = localStorage.getItem(LOCAL_EVENTS);
    if (raw) return JSON.parse(raw);

    const d = today;

    const sample = [
      {
        id: uid(),
        title: "Event1",
        venueId: venues[0]?.id,
        date: format(d, "yyyy-MM-dd"),
        start: new Date(d.setHours(9, 0, 0, 0)).toISOString(),
        end: new Date(d.setHours(9, 30, 0, 0)).toISOString(),
      },
      {
        id: uid(),
        title: "Event2",
        venueId: venues[0]?.id,
        date: format(d, "yyyy-MM-dd"),
        start: new Date(d.setHours(10, 0, 0, 0)).toISOString(),
        end: new Date(d.setHours(10, 30, 0, 0)).toISOString(),
      },
      {
        id: uid(),
        title: "Event3",
        venueId: venues[0]?.id,
        date: format(d, "yyyy-MM-dd"),
        start: new Date(d.setHours(9, 45, 0, 0)).toISOString(),
        end: new Date(d.setHours(11, 0, 0, 0)).toISOString(),
      },
    ];

    localStorage.setItem(LOCAL_EVENTS, JSON.stringify(sample));
    return sample;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_VENUES, JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem(LOCAL_EVENTS, JSON.stringify(events));
  }, [events]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const time = timeRef.current;
    if (!grid || !time) return;

    const fn = () => {
      time.scrollTop = grid.scrollTop;
    };

    grid.addEventListener("scroll", fn);
    return () => grid.removeEventListener("scroll", fn);
  }, []);

  return (
    <EventTimeTableVenuesPresenter
      venues={venues}
      scrollRefs={{
        scrollRef,
        gridRef,
        timeRef,
      }}
    />
  );
}
