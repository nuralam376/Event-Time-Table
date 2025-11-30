import { format, startOfDay, addDays, setHours, setMinutes } from "date-fns";
import type { TEventItem, TVenue } from "../components/eventTimeTableVenues/EventTimeTableVenues.schema";

const uid = () => Math.random().toString(36).slice(2);

export const buildSampleEventData = (): {
  venues: TVenue[];
  events: TEventItem[];
} => {
  const today = startOfDay(new Date());

  const venue1 = { id: uid(), name: "Venue1" };
  const venue2 = { id: uid(), name: "Venue2" };
  const venue3 = { id: uid(), name: "Venue3" };

  const venues = [venue1, venue2, venue3];

  const clone = (d: Date) => new Date(d.getTime());

  const tuesday = addDays(today, (2 - today.getDay() + 7) % 7);
  const wednesday = addDays(today, (3 - today.getDay() + 7) % 7);
  const thursday = addDays(today, (4 - today.getDay() + 7) % 7);

  const events: TEventItem[] = [
    {
      id: uid(),
      title: "Event 1",
      venueId: venue1.id,
      date: format(tuesday, "yyyy-MM-dd"),
      start: setMinutes(setHours(clone(tuesday), 9), 0).toISOString(),
      end: setMinutes(setHours(clone(tuesday), 9), 30).toISOString(),
    },
    {
      id: uid(),
      title: "Event 2",
      venueId: venue2.id,
      date: format(wednesday, "yyyy-MM-dd"),
      start: setMinutes(setHours(clone(wednesday), 12), 0).toISOString(),
      end: setMinutes(setHours(clone(wednesday), 12), 30).toISOString(),
    },
    {
      id: uid(),
      title: "Event 3",
      venueId: venue3.id,
      date: format(thursday, "yyyy-MM-dd"),
      start: setMinutes(setHours(clone(thursday), 9), 45).toISOString(),
      end: setMinutes(setHours(clone(thursday), 11), 0).toISOString(),
    }
  ];

  return { venues, events };
};
