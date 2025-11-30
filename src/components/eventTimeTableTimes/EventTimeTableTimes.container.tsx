import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  startOfDay,
  differenceInMinutes,
  format,
} from "date-fns";
import EventTimeTableTimesPresenter from "./EventTimeTableTimes.presenter";
import type { TEventItem, TVenue } from "./EventTimeTableTimes.schema";
import { buildSampleEventData } from "../../data";

const LOCAL_VENUES = "ett_venues_v3";
const LOCAL_EVENTS = "ett_events_v3";

const ROW_HEIGHT = 20;
const ROW_MIN = 15;

const buildTimes = () => {
  const arr: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += ROW_MIN) {
      arr.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return arr;
};
const TIMES = buildTimes();

export default function EventTimeTableTimesContainer() {
  const today = startOfDay(new Date());


  const days = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(today, i)),
    [today]
  );


  const sample = useMemo(() => buildSampleEventData(), []);

  
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


  const dayIndex = useMemo(() => {
    const firstEvent = events.find((ev) =>
      days.some((d) => format(d, "yyyy-MM-dd") === ev.date)
    );

    if (!firstEvent) return 0;

    const idx = days.findIndex(
      (d) => format(d, "yyyy-MM-dd") === firstEvent.date
    );

    return idx >= 0 ? idx : 0;
  }, [events, days]);


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
      venueHeader.scrollLeft = grid.scrollLeft;
    };

    const onTimeScroll = () => {
      grid.scrollTop = time.scrollTop;
    };

    grid.addEventListener("scroll", onGridScroll);
    time.addEventListener("scroll", onTimeScroll);

    return () => {
      grid.removeEventListener("scroll", onGridScroll);
      time.removeEventListener("scroll", onTimeScroll);
    };
  }, []);

  const eventsForDay = events;

  const calcTop = (iso: string) => {
    const d = new Date(iso);
    const idx = (d.getHours() * 60 + d.getMinutes()) / ROW_MIN;
    return idx * ROW_HEIGHT;
  };

  const calcHeight = (start: string, end: string) => {
    const mins = differenceInMinutes(new Date(end), new Date(start));
    return (mins / ROW_MIN) * ROW_HEIGHT;
  };

  return (
    <EventTimeTableTimesPresenter
      times={TIMES}
      venues={venues}
      events={eventsForDay}
      dayIndex={dayIndex}
      calcTop={calcTop}
      calcHeight={calcHeight}
      scrollRefs={{ timeRef, gridRef, scrollRef }}
    />
  );
}
