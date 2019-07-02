import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from "lodash";
import * as moment from 'moment';
import 'rxjs/add/operator/finally';
import { months } from "../../data/month-data";
import { CalendarDate } from "../models/CalendarDate";
import { City } from '../models/City';
import { DayWeather } from '../models/DayWeather';
import { Month } from "../models/Month";
import { WeatherInfo } from '../models/WeatherInfo';
import { Year } from "../models/Year";
import { GetWeatherByLocationService } from '../services/weather/getWeatherByLocation.resolver';
import { GetWeatherByZipCodeService } from '../services/weather/getWeatherByZipCode.resolver';
import { WeatherService } from '../services/weather/weather-service';
import { DayWeatherInfoComponent } from './day-weather-info/day-weather-info.component';

@Component({
  selector: 'app-inspector-calendar',
  templateUrl: './inspector-calendar.component.html',
  styleUrls: ['./inspector-calendar.component.scss'],
  providers: [WeatherService, GetWeatherByZipCodeService, GetWeatherByLocationService, MatDialog]
})

export class InspectorCalendarComponent implements OnInit, AfterViewInit {

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
  cityInfo: City = new City(0, "", "", undefined);
  showWeatherControls: boolean = true;

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
    this.titleService.setTitle("Paco Rosa Cotecna Exercise");
    this.yearOptions = this.loadYearsDdl();
    this.monthOptions = this.loadMonthsDdl();
    this.initCalendar();
  }

  ngAfterViewInit(): void {
    this.getLocationBrowser();
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

  isCurrentYearAndMonth(): boolean {
    let result: boolean = this.selectedYear === new Date().getFullYear() && this.selectedMonth === new Date().getMonth();
    this.showWeatherControls = result;
    return result;
  }

  // generate the calendar grid

  initCalendar() {
    let dates = this.fillDates(this.currentDate);
    let weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    let firstOfMonth = moment(currentMoment).startOf('month').day() - 1;
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth === -1 ? 6 : firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    let result = _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d,
          weather: this.getDayWeather(d),
          currentWeather: this.getCurrentWeather(d)
        };
      });
    return result;
  }

  // generate the weather forecast

  async getForecastZipCode() {
    if (this.isCurrentYearAndMonth()) {
      this.weatherResponse = [];
      this.weatherService.zipCode = this.zipcodeControl.value;
      await this.weatherService.getWeatherByZipCode().toPromise()
        .then((response: DayWeather) => response.weather.forEach(row => { this.weatherResponse.push(row); },
          this.cityInfo = response.city))
        .catch(() => {
          this.showHideZipCodeError(true);;
        });
      this.weatherDays = this.weatherResponse;
    }
  }

  async getForecastLocation() {
    if (this.isCurrentYearAndMonth()) {
      this.weatherResponse = [];
      await this.weatherService.getWeatherByLocation().toPromise()
        .then((response: DayWeather) => response.weather.forEach(row => { this.weatherResponse.push(row); },
          this.cityInfo = response.city));
      this.weatherDays = this.weatherResponse;
    }
  }

  getDayWeather(moment): WeatherInfo[] {
    let result: WeatherInfo[] = this.weatherDays.filter(x =>
      new Date(x.date).getDate() === moment.date() &&
      new Date(x.date).getMonth() === moment.month());

    if (result.length === 0)
      result.push(WeatherInfo.createEmptyObject());

    return result;
  }

  getCurrentWeather(moment): WeatherInfo {
    let result = this.weatherDays.filter(x => {
      let res: WeatherInfo[] = [];
      let baseDate = new Date(x.date);

      if (baseDate.getMonth() === moment.month() &&
        baseDate.getDate() === moment.date() &&
        baseDate.getHours() <= new Date().getHours()) {
        res.push(x);
        return res;
      };
    });

    return result[result.length - 1] === undefined ? WeatherInfo.createEmptyObject() : result[result.length - 1];
  }

  // events

  onMonthDdlChanged(month: Month): void {
    this.currentDate = moment(this.currentDate).month(((month.value) as any)).startOf('month');
    this.isCurrentYearAndMonth();
    this.initCalendar();
  }

  onYearDdlChanged(year: Year): void {
    this.currentDate = moment(this.currentDate).year(((year.value) as any));
    this.isCurrentYearAndMonth();
    this.initCalendar();
  }

  viewDay(day: CalendarDate) {
    if (day.weather[0].main !== "") {
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
    navigator.geolocation.getCurrentPosition(
      position => {
        this.weatherService.posLat = position.coords.latitude;
        this.weatherService.posLon = position.coords.longitude;

        this.getForecastLocation().then(() => {
          this.initCalendar();
          this.showZipCodeError = false;
        });

      },
      () => {
        //TODO Change icon styles to make show it as a disabled
        alert('Location permission blocked. Use zip code textbox to load forecast!');
      });
  }

  showHideZipCodeError(show: boolean) {
    this.showZipCodeError = show;
    if (!show)
      this.cityInfo.name = "";
  }

  getWeatherByZipCode() {
    this.showHideZipCodeError(false);
    this.zipcodeControl.value !== null && this.zipcodeControl.value !== ""
      ? this.getForecastZipCode()
        .then(() => { this.initCalendar() })
        .catch(() => this.showHideZipCodeError(true) )
      : this.showHideZipCodeError(true);
  }
}
