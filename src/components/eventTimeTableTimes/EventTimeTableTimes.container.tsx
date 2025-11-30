import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, startOfDay, differenceInMinutes, format } from "date-fns";
import EventTimeTableTimesPresenter from "./EventTimeTableTimes.presenter";
import type { TEventItem, TVenue } from "./EventTimeTableTimes.schema";

const LOCAL_VENUES = "ett_venues_v3";
const LOCAL_EVENTS = "ett_events_v3";

const ROW_HEIGHT = 20;
const ROW_MIN = 15;

const uid = () => Math.random().toString(36).slice(2);

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

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  }, []);

  // ---------- Local Storage ----------
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

  // ---------- UI State ----------
  const [dayIndex] = useState(0);

  // ---------- Scroll Sync ----------
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

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

  const eventsForDay = events.filter(
    (ev) => ev.date === format(days[dayIndex], "yyyy-MM-dd")
  );

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
      scrollRefs={{
        timeRef,
        gridRef,
        scrollRef,
      }}
    />
  );
}
