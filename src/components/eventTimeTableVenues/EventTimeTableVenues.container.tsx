import { useEffect, useRef, useState } from "react";
import EventTimeTableVenuesPresenter from "./EventTimeTableVenues.presenter";
import type { TEventItem, TVenue } from "./EventTimeTableVenues.schema";
import { buildSampleEventData } from "../../data";

const LOCAL_VENUES = "ett_venues_v3";
const LOCAL_EVENTS = "ett_events_v3";

export default function EventTimeTableVenuesContainer() {
  const sample = buildSampleEventData();

  const [venues] = useState<TVenue[]>(() => {
    const raw = localStorage.getItem(LOCAL_VENUES);
    if (raw) return JSON.parse(raw);

    localStorage.setItem(LOCAL_VENUES, JSON.stringify(sample.venues));
    return sample.venues;
  });

  const [events] = useState<TEventItem[]>(() => {
    const raw = localStorage.getItem(LOCAL_EVENTS);
    if (raw) return JSON.parse(raw);

    localStorage.setItem(LOCAL_EVENTS, JSON.stringify(sample.events));
    return sample.events;
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
    const venueHeader = scrollRef.current;

    if (!grid || !time || !venueHeader) return;

    const onGridScroll = () => {
      time.scrollTop = grid.scrollTop;
    };

    const onTimeScroll = () => {
      grid.scrollTop = time.scrollTop;
    };

    const onGridHorizontal = () => {
      venueHeader.scrollLeft = grid.scrollLeft;
    };

    grid.addEventListener("scroll", onGridScroll);
    grid.addEventListener("scroll", onGridHorizontal);
    time.addEventListener("scroll", onTimeScroll);

    return () => {
      grid.removeEventListener("scroll", onGridScroll);
      grid.removeEventListener("scroll", onGridHorizontal);
      time.removeEventListener("scroll", onTimeScroll);
    };
  }, []);

  return (
    <EventTimeTableVenuesPresenter
      venues={venues}
      scrollRefs={{ scrollRef, gridRef, timeRef }}
    />
  );
}
