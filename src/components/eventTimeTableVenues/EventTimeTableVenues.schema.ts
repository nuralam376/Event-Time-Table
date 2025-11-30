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

export type TEventTimeTableVenuesPresenterProps =  {
  venues: TVenue[];
  scrollRefs: {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    gridRef: React.RefObject<HTMLDivElement | null>;
    timeRef: React.RefObject<HTMLDivElement | null>;
  };
}
