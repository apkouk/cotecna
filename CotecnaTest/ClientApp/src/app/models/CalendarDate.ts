import * as moment from 'moment';
import { DayWeather } from './DayWeather';
import { WeatherInfo } from './WeatherInfo';

export class CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  weather: WeatherInfo[];

  constructor(mDate: moment.Moment, selected: boolean, today: boolean, weather: WeatherInfo[]) {
    this.mDate = mDate;
    this.selected = selected;
    this.today = today;
    this.weather = weather;
  }

}
