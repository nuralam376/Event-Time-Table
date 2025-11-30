import { useMemo, useState } from "react";
import { addDays, startOfWeek } from "date-fns";
import EventTimeTableDaysPresenter from "./EventTimeTableDays.presenter";

export default function EventTimeTableDaysContainer() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const days = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const [dayIndex, setDayIndex] = useState(0);

  return (
    <EventTimeTableDaysPresenter
      days={days}
      dayIndex={dayIndex}
      onChange={setDayIndex}
      minWidth="1000px"
    />
  );
}
