import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Modal,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, addDays, startOfDay, differenceInMinutes } from "date-fns";

const LOCAL_VENUES = "ett_venues_v3";
const LOCAL_EVENTS = "ett_events_v3";

const ROW_HEIGHT = 20;
const ROW_MIN = 15;
const VENUE_WIDTH = 200;
const TIME_WIDTH = 80;

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

export default function EventTimeTable() {
  const today = startOfDay(new Date());

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  }, []);

  // ---------- LocalStorage ----------
  const [venues, setVenues] = useState(() => {
    const raw = localStorage.getItem(LOCAL_VENUES);
    if (raw) return JSON.parse(raw);

    const sample = [
      { id: uid(), name: "Hall A" },
      { id: uid(), name: "Hall B" },
      { id: uid(), name: "Auditorium" },
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
        title: "Opening Ceremony",
        venueId: venues[0]?.id,
        date: format(d, "yyyy-MM-dd"),
        start: new Date(d.setHours(9, 0, 0, 0)).toISOString(),
        end: new Date(d.setHours(10, 0, 0, 0)).toISOString(),
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
  const [addOpen, setAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: format(days[0], "yyyy-MM-dd"),
    venue: "",
    start: "09:00",
    duration: 60,
  });

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

  const addEvent = () => {
    const { title, venue, date, start, duration } = formData;

    const [h, m] = start.split(":");
    const s = new Date(date);
    s.setHours(Number(h), Number(m), 0, 0);

    const e = new Date(s.getTime() + duration * 60 * 1000);

    const newEv = {
      id: uid(),
      title: title || "Untitled",
      venueId: venue,
      date,
      start: s.toISOString(),
      end: e.toISOString(),
    };

    setEvents((p) => [...p, newEv]);
    setAddOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((p) => p.filter((ev) => ev.id !== id));
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Event Time Table
      </Typography>

      {/* ================= Day Tabs ================= */}
      <Paper sx={{ mb: 1 }}>
        <Tabs
          value={dayIndex}
          onChange={(e, v) => {
            setDayIndex(v);
            setFormData((fd) => ({ ...fd, date: format(days[v], "yyyy-MM-dd") }));
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {days.map((d, idx) => (
            <Tab
              key={idx}
              value={idx}
              label={
                <Box>
                  <Typography sx={{ fontSize: 14 }}>{format(d, "EEEE")}</Typography>
                  <Typography variant="caption">{format(d, "dd MMMM yyyy")}</Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* ================= Venue Bar (Sticky Vertically) ================= */}
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
          {/* EMPTY Cell above time column */}
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

      {/* ================= Time Column + Event Grid ================= */}
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

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(ev.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Add Event Button */}
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setAddOpen(true)}
      >
        Add Event
      </Button>

      {/* Add Event Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Paper
          sx={{
            p: 3,
            width: 400,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Event
          </Typography>

          <TextField
            label="Title"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.title}
            onChange={(e) =>
              setFormData((f) => ({ ...f, title: e.target.value }))
            }
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Venue</InputLabel>
            <Select
              value={formData.venue}
              label="Venue"
              onChange={(e) =>
                setFormData((f) => ({ ...f, venue: String(e.target.value) }))
              }
            >
              {venues.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Date"
            type="date"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={(e) =>
              setFormData((f) => ({ ...f, date: e.target.value }))
            }
          />

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="Start"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.start}
              onChange={(e) =>
                setFormData((f) => ({ ...f, start: e.target.value }))
              }
            />

            <TextField
              label="Duration (min)"
              type="number"
              fullWidth
              value={formData.duration}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  duration: Number(e.target.value),
                }))
              }
            />
          </Box>

          <Button variant="contained" onClick={addEvent}>
            Save
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
}
