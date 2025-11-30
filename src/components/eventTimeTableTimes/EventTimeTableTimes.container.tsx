import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { format, addDays, startOfDay, differenceInMinutes } from "date-fns";

const LOCAL_VENUES = "ett_venues_v3";
const LOCAL_EVENTS = "ett_events_v3";

const ROW_HEIGHT = 20;
const ROW_MIN = 15;
const VENUE_WIDTH = 350;
const TIME_WIDTH = 150;

const uid = () => Math.random().toString(36).slice(2);

// Build all times every 15 minutes
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

export default function EventTimeTableTimesCotainer() {
  const today = startOfDay(new Date());

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  }, []);

  // ---------- LocalStorage ----------
  const [venues, setVenues] = useState(() => {
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

  const [events, setEvents] = useState(() => {
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
  const [dayIndex, setDayIndex] = useState(0);

  // ---------- Scroll References ----------
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);

  // Sync vertical scroll (time column & grid)
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

  // ---------- Event Helpers ----------
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
    <Box sx={{ display: "flex", mt: 0 }}>
      {/* Time Column */}
      <Paper
        ref={timeRef}
        sx={{
          width: TIME_WIDTH,
          maxHeight: 600,
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        {TIMES.map((t) => (
          <Box
            key={t}
            sx={{
              height: ROW_HEIGHT,
              borderBottom: "1px dashed #eee",
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="caption">{t}</Typography>
          </Box>
        ))}
      </Paper>

      {/* Event Grid */}
      <Box
        sx={{
          overflow: "auto",
          maxHeight: 600,
        }}
        ref={gridRef}
        onScroll={(e) => {
          if (scrollRef.current)
            scrollRef.current.scrollLeft = (e.target as HTMLDivElement).scrollLeft;
        }}
      >
        <Box sx={{ display: "flex", minWidth: venues.length * VENUE_WIDTH }}>
          {venues.map((v) => (
            <Box
              key={v.id}
              sx={{
                width: VENUE_WIDTH,
                borderRight: "1px solid #f1f1f1",
                position: "relative",
              }}
            >
              {/* Background time rows */}
              {TIMES.map((t) => (
                <Box
                  key={t}
                  sx={{
                    height: ROW_HEIGHT,
                    borderBottom: "1px dashed #f3f3f3",
                  }}
                />
              ))}

              {/* Events */}
              {eventsForDay
                .filter((ev) => ev.venueId === v.id)
                .map((ev) => (
                  <Paper
                    key={ev.id}
                    sx={{
                      position: "absolute",
                      top: calcTop(ev.start),
                      left: 6,
                      right: 6,
                      height: calcHeight(ev.start, ev.end),
                      bgcolor: "#d7ebff",
                      p: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="caption">{ev.title}</Typography>
                  </Paper>
                ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  
  );
}
