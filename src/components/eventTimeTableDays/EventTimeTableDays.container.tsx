import {  useMemo, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
} from "@mui/material";
import { format, addDays, startOfDay } from "date-fns";


export default function EventTimeTableDaysCotainer() {
  const today = startOfDay(new Date());

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  }, []);

  const [dayIndex, setDayIndex] = useState(0);

 
  return (
    <Paper sx={{ mb: 1 }}>
        <Tabs
            value={dayIndex}
            onChange={(e, v) => {
            setDayIndex(v);
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
   
  );
}
