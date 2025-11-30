export type TVenue = {
  id: string;
  name: string;
}

export type TEventItem = {
  id: string;
  title: string;
  venueId: string;
  date: string;
  start: string;
  end: string;
}

export type TEventTimeTableTimesPresenterProps = {
  times: string[];
  venues: TVenue[];
  events: TEventItem[];
  dayIndex: number;
  calcTop: (iso: string) => number;
  calcHeight: (start: string, end: string) => number;

    scrollRefs: {
    timeRef: React.RefObject<HTMLDivElement | null>;
    gridRef: React.RefObject<HTMLDivElement | null>;
    scrollRef: React.RefObject<HTMLDivElement | null>;
  };
}
