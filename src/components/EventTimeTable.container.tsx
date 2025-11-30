import EventTimeTableDaysCotainer from "./eventTimeTableDays/EventTimeTableDays.container";
import EventTimeTableVenuesContainer from "./eventTimeTableVenues/EventTimeTableVenues.container";
import EventTimeTableTimesCotainer from "./eventTimeTableTimes/EventTimeTableTimes.container";
import { Box } from "@mui/material";

export default function EventTimeTableCotainer() {
  return (
    <Box sx={{ p: 2 }}>
      <EventTimeTableDaysCotainer />
      <EventTimeTableVenuesContainer />
      <EventTimeTableTimesCotainer />
    </Box>
  );
}
