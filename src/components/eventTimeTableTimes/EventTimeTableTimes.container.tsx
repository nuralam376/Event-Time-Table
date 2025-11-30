import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  startOfDay,
  differenceInMinutes,
  format,
  setMinutes,
  setHours,
} from "date-fns";
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

  // -----------------------------------------
  // Venues
  // -----------------------------------------
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

  // -----------------------------------------
  // Events (Tue/Wed/Thu)
  // -----------------------------------------
  const [events] = useState<TEventItem[]>(() => {
    const raw = localStorage.getItem(LOCAL_EVENTS);
    if (raw) return JSON.parse(raw);

    const today = startOfDay(new Date());

    // Get specific upcoming days (no mutation)
    const tuesday = addDays(today, (2 - today.getDay() + 7) % 7);
    const wednesday = addDays(today, (3 - today.getDay() + 7) % 7);
    const thursday = addDays(today, (4 - today.getDay() + 7) % 7);

    const clone = (d: Date) => new Date(d.getTime());

    const sample = [ 
      {
        id: uid(),
        title: "Event 1",
        venueId: venues[0]?.id,
        date: format(tuesday, "yyyy-MM-dd"),
        start: setMinutes(setHours(clone(tuesday), 9), 0).toISOString(),
        end: setMinutes(setHours(clone(tuesday), 9), 30).toISOString(),
      },
      {
        id: uid(),
        title: "Event 2",
        venueId: venues[0]?.id,
        date: format(wednesday, "yyyy-MM-dd"),
        start: setMinutes(setHours(clone(wednesday), 12), 0).toISOString(),
        end: setMinutes(setHours(clone(wednesday), 12), 30).toISOString(),
      },
      {
        id: uid(),
        title: "Event 3",
        venueId: venues[0]?.id,
        date: format(thursday, "yyyy-MM-dd"),
        start: setMinutes(setHours(clone(thursday), 9), 45).toISOString(),
        end: setMinutes(setHours(clone(thursday), 11), 0).toISOString(),
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

  // -----------------------------------------
  // UI State
  // -----------------------------------------
  const [dayIndex] = useState(0);

  // -----------------------------------------
  // Scroll Sync Refs
  // -----------------------------------------
  const scrollRef = useRef<HTMLDivElement | null>(null); // Venue header
  const gridRef = useRef<HTMLDivElement | null>(null); // Event grid
  const timeRef = useRef<HTMLDivElement | null>(null); // Time column

  // -----------------------------------------
  // Scroll Sync Logic (Vertical + Horizontal)
  // -----------------------------------------
  useEffect(() => {
    const grid = gridRef.current;
    const time = timeRef.current;
    const venueHeader = scrollRef.current;

    if (!grid || !time || !venueHeader) return;

    // Vertical scroll sync
    const onGridScroll = () => {
      time.scrollTop = grid.scrollTop;
      venueHeader.scrollTop = grid.scrollTop;
    };

    const onTimeScroll = () => {
      grid.scrollTop = time.scrollTop;
      venueHeader.scrollTop = time.scrollTop;
    };

    // Horizontal scroll sync
    const onGridHorizontalScroll = () => {
      venueHeader.scrollLeft = grid.scrollLeft;
    };

    grid.addEventListener("scroll", onGridScroll);
    grid.addEventListener("scroll", onGridHorizontalScroll);
    time.addEventListener("scroll", onTimeScroll);

    return () => {
      grid.removeEventListener("scroll", onGridScroll);
      grid.removeEventListener("scroll", onGridHorizontalScroll);
      time.removeEventListener("scroll", onTimeScroll);
    };
  }, []);

  // -----------------------------------------
  // Filter events for selected day
  // -----------------------------------------
  const eventsForDay = events.filter(
    (ev) => ev.date === format(days[dayIndex], "yyyy-MM-dd")
  );

  // -----------------------------------------
  // Layout calculations
  // -----------------------------------------
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
