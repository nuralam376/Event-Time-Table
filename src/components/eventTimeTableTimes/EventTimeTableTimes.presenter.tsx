import { Box, Paper, Typography } from "@mui/material";
import type { TEventTimeTableTimesPresenterProps } from "./EventTimeTableTimes.schema";

const ROW_HEIGHT = 20;
const VENUE_WIDTH = 350;
const TIME_WIDTH = 150;

export default function EventTimeTableTimesPresenter({
  times,
  venues,
  events,
  calcTop,
  calcHeight,
  scrollRefs: { timeRef, gridRef, scrollRef },
}: TEventTimeTableTimesPresenterProps) {
  return (
    <Box sx={{ display: "flex", mt: 0 }}>
      <Paper
        ref={timeRef}
       sx={{
            width: TIME_WIDTH,
            maxHeight: 600,
            overflowY: "auto",
            overflowX: "hidden",
            flexShrink: 0,
        }}
      >
        {times.map((t) => (
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
              {times.map((t) => (
                <Box
                  key={t}
                  sx={{
                    height: ROW_HEIGHT,
                    borderBottom: "1px dashed #f3f3f3",
                  }}
                />
              ))}

              {events
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