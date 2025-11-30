export interface TEventTimeTableDaysPresenterProps {
  days: Date[];
  dayIndex: number;
  onChange: (value: number) => void;
  minWidth?: number | string;
}
