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
import { GetWeatherByZipCodeService } from '../services/weather/getWeatherByZipCode.resolver';
import { GetWeatherByLocationService } from '../services/weather/getWeatherByLocation.resolver';
import { DayWeatherInfoComponent } from './day-weather-info/day-weather-info.component';
import { WeatherInfo } from '../models/WeatherInfo';
import { City } from '../models/City';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inspector-calendar',
  templateUrl: './inspector-calendar.component.html',
  styleUrls: ['./inspector-calendar.component.scss'],
  providers: [WeatherService, GetWeatherByZipCodeService, GetWeatherByLocationService, MatDialog]
})

export class InspectorCalendarComponent implements OnInit, OnChanges {
  currentDate = moment();
  dayNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];

  yearOptions: Year[] = [];
  selectedYear: number;

  monthOptions: Month[] = [];
  selectedMonth: number;

  weatherDays: WeatherInfo[] = [];
  weatherResponse: WeatherInfo[] = [];
  cityInfo: City = undefined;
  showWeatherControls: boolean = false;
  findByLocation: boolean = false;
  findByZipCode: boolean = true;

  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  zipcodeControl = new FormControl();
  showZipCodeError: boolean = false;

  public constructor(private titleService: Title,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.weatherService.zipCode = "36201";
    this.titleService.setTitle("Paco Rosa Cotecna Exercise");
    this.getDataResolver();
    this.generateCalendar();
    this.yearOptions = this.loadYearsDdl();
    this.monthOptions = this.loadMonthsDdl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateCalendar();
  }

  getDataResolver() {
    this.route.data.map((data: any) => data.getWeatherByZipCodeService).subscribe((response: DayWeather) => response.weather.forEach(row => {
      this.weatherDays.push(row);
    }, this.cityInfo = response.city));
  }

  // load dropdowns

  loadYearsDdl(): Year[] {
    let result: Year[] = [];
    var currentYear = new Date().getFullYear();
    var firstYear = currentYear - 10;

    for (var i = 1; i < 21; i++) {
      let year: Year = new Year(firstYear + i, firstYear + i);
      result.push(year);

      if (year.value === currentYear)
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

  // generate the calendar grid

  generateCalendar(): void {
    this.getForecast(this.currentDate.month()).then(() => {
      let dates = this.fillDates(this.currentDate);
      let weeks: CalendarDate[][] = [];
      while (dates.length > 0) {
        weeks.push(dates.splice(0, 7));
      }
      this.weeks = weeks;
    });
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    let result: CalendarDate[] = [];
    const firstOfMonth = moment(currentMoment).startOf('month').day() - 1;
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    result = _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d,
          weather: this.getDayWeather(d)
        };
      });
    return result;
  }

  // generate the weather forecast

  async getForecast(selectedMonth: number) {
    if (selectedMonth === new Date().getMonth()) {
      this.showWeatherControls = true;
      this.weatherResponse = [];

      if (this.findByZipCode) {
        await this.weatherService.getWeatherByZipCode().toPromise()
          .then((response: DayWeather) => response.weather.forEach(row => { this.weatherResponse.push(row); }, this.cityInfo = response.city))
          .catch(() => { this.showZipCodeError = true; });
        this.findByZipCode = false;
      }

      if (this.findByLocation) {
        await this.weatherService.getWeatherByLocation().toPromise()
          .then((response: DayWeather) => response.weather.forEach(row => { this.weatherResponse.push(row); }, this.cityInfo = response.city));
        this.findByLocation = false;
      }

      this.weatherDays = this.weatherResponse;
    }
  }

  getDayWeather(moment): WeatherInfo[] {
    let result: WeatherInfo[] = this.weatherDays.filter(x =>
      new Date(x.date).getDate() === moment.date() &&
      new Date(x.date).getMonth() === moment.month());

    if (result === undefined)
      result.push(WeatherInfo.createEmptyObject());

    return result;
  }

  // events

  onMonthDdlChanged(month: Month): void {
    this.showWeatherControls = false;
    this.currentDate = moment(this.currentDate).month(((month.value) as any));
    this.generateCalendar();

  }

  onYearDdlChanged(year: Year): void {
    this.currentDate = moment(this.currentDate).year(((year.value) as any));
    this.generateCalendar();
  }

  viewDay(day: CalendarDate) {
    if (day.weather.length !== 0) {
      this.dialog.open(DayWeatherInfoComponent, {
        data: {
          day: day.mDate,
          data: day.weather,
          city: this.cityInfo
        }
      });
    }
  }

  getLocationBrowser() {
    navigator.geolocation.getCurrentPosition(position => {
      this.weatherService.posLat = position.coords.latitude;
      this.weatherService.posLon = position.coords.longitude;
      this.findByLocation = true;
      this.generateCalendar();
    });
  }

  getWeatherByZipCode() {
    this.showZipCodeError = false;
    if (this.zipcodeControl.value !== null && this.zipcodeControl.value !== "") {
      this.weatherService.zipCode = this.zipcodeControl.value;
      this.findByZipCode = true;
      this.generateCalendar();
    }
    else {
      this.showZipCodeError = true;
    }
  }

}
