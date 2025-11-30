import { Box, Paper, Typography } from "@mui/material";
import type { TEventTimeTableVenuesPresenterProps } from "./EventTimeTableVenues.schema";

const VENUE_WIDTH = 350;
const TIME_WIDTH = 150;

export default function EventTimeTableVenuesPresenter({
  venues,
  scrollRefs: { scrollRef },
}: TEventTimeTableVenuesPresenterProps) {
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
