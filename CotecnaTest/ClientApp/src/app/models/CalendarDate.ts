import * as moment from 'moment';
import { DayWeather } from './DayWeather';
import { WeatherInfo } from './WeatherInfo';

export class CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  weather: WeatherInfo[];
}
