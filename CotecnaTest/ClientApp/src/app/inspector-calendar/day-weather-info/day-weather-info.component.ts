import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import 'rxjs/add/operator/finally';
import { CalendarDate } from "../../models/CalendarDate";


@Component({
  selector: 'day-weather-info',
  templateUrl: './day-weather-info.component.html'
})

export class DayWeatherInfoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public calendarDate: any) { }
}
