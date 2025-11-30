import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { format, startOfDay } from "date-fns";

const LOCAL_VENUES = "ett_venues_v3";
const LOCAL_EVENTS = "ett_events_v3";

const VENUE_WIDTH = 350;
const TIME_WIDTH = 150;

const uid = () => Math.random().toString(36).slice(2);

export default function EventTimeTableVenuesContainer() {
  const today = startOfDay(new Date());

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


  return (
    <Box
      sx={{
        position: "sticky",
        top: 62,
        zIndex: 10,
        background: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        overflowX: "auto",
      }}
      ref={scrollRef}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: TIME_WIDTH,
            flexShrink: 0,
            height: 50,
            borderRight: "1px solid #ddd",
            background: "#f5f5f5",
          }}
        />

        {/* Venue Names */}
        <Box sx={{ display: "flex", minWidth: venues.length * VENUE_WIDTH }}>
          {venues.map((v) => (
            <Paper
              key={v.id}
              sx={{
                width: VENUE_WIDTH,
                px: 2,
                py: 1,
                borderRight: "1px solid #eee",
                flexShrink: 0,
              }}
            >
              <Typography variant="subtitle2">{v.name}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
