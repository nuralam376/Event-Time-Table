import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { format } from "date-fns";
import type { TEventTimeTableDaysPresenterProps } from "./EventTimeTableDays.schema";

export default function EventTimeTableDaysPresenter({
  days,
  dayIndex,
  onChange,
  minWidth = "1000px",
}: TEventTimeTableDaysPresenterProps) {
  return (
    <Paper sx={{ mb: 1, overflowX: "auto" }}>
      <Tabs
        value={dayIndex}
        onChange={(e, v) => onChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minWidth }}
      >
        {days.map((d, idx) => (
          <Tab
            key={idx}
            value={idx}
            label={
              <Box>
                <Typography sx={{ fontSize: 14 }}>
                  {format(d, "EEEE")}
                </Typography>
                <Typography variant="caption">
                  Date: {format(d, "yyyy-MM-dd")}
                </Typography>
              </Box>
            }
          />
        ))}
      </Tabs>
    </Paper>
  );
}
