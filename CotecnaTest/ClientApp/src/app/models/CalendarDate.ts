import * as moment from 'moment';
import { DayWeather } from './DayWeather';

export class CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  weather: DayWeather[];
}
