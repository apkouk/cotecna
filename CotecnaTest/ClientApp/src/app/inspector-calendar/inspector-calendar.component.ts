import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from "lodash";
import * as moment from 'moment';
import 'rxjs/add/operator/finally';
import { months } from "../../data/month-data";
import { CalendarDate } from "../models/CalendarDate";
import { DayWeather } from '../models/DayWeather';
import { Month } from "../models/Month";
import { Year } from "../models/Year";
import { WeatherService } from '../services/weather/weather-service';
import { WeatherServiceResolver } from '../services/weather/weather-service-resolver';
import { DayWeatherInfoComponent } from './day-weather-info/day-weather-info.component';

@Component({
  selector: 'app-inspector-calendar',
  templateUrl: './inspector-calendar.component.html',
  styleUrls: ['./inspector-calendar.component.scss'],
  providers: [WeatherService, WeatherServiceResolver, MatDialog]
})

export class InspectorCalendarComponent implements OnInit, OnChanges {
  currentDate = moment();
  dayNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];

  yearOptions: Year[] = [];
  selectedYear: string = "";

  monthOptions: Month[] = [];
  selectedMonth: number;

  weatherDays: DayWeather[] = [];

  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  public constructor(private titleService: Title, public router: Router, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.titleService.setTitle("Paco Rosa Cotecna Exercise");
    this.generateCalendar();
    this.yearOptions = this.loadYearsDdl();
    this.monthOptions = this.loadMonthsDdl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateCalendar();
  }

  // load dropdowns

  loadYearsDdl(): Year[] {
    let result: Year[] = [];
    var currentYear = new Date().getFullYear();
    var firstYear = currentYear - 10;

    for (var i = 1; i < 21; i++) {
      let year: Year = new Year(firstYear + i, firstYear + i);
      result.push(year);

      if (year.value === currentYear.toString())
        this.selectedYear = year.value;
    }

    return result;
  }

  loadMonthsDdl(): Month[] {
    let result: Month[] = months;
    this.selectedMonth = new Date().getMonth();
    return result;
  }

  // date checkers

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    this.onSelectDate.emit(date);
  }

  // actions from calendar

  onMonthDdlChanged(month: Month): void {
    this.currentDate = moment(this.currentDate).month(((month.value) as any));
    this.generateCalendar();
  }

  onYearDdlChanged(year: Year): void {
    this.currentDate = moment(this.currentDate).year(((year.value) as any));
    this.generateCalendar();
  }

  // generate the calendar grid

  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day() - 1;
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    this.getForecast(this.currentDate.month());
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d,
          weather: this.getDayWeather(d)
        };
      });
  }

  async getForecast(selectedMonth: number) {
    if (selectedMonth === new Date().getMonth()) {
      if (this.weatherDays.length === 0) {
        this.route.data.map((data: any) => data.weatherServiceResolver).subscribe((response: DayWeather[]) => response.forEach(row => {
          this.weatherDays.push(row);
        }));
      }
    }
  }

  getDayWeather(moment): DayWeather[] {
    let result: DayWeather[] = this.weatherDays.filter(x =>
      new Date(x.date).getDate() === moment.date() &&
      new Date(x.date).getMonth() === moment.month());

    if (result === undefined)
      result.push(DayWeather.createEmptyObject());

    return result;
  }

  viewDay(day: CalendarDate) {
    if (day.weather.length !== 0) {
      this.dialog.open(DayWeatherInfoComponent, {
        data: day
      });
    }
  }
}
