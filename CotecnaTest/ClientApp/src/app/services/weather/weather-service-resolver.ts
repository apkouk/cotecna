import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DayWeather } from '../../models/DayWeather';
import { WeatherService } from './weather-service';
import 'rxjs/add/operator/map';

@Injectable()

export class WeatherServiceResolver implements Resolve<any> {

  constructor(private weatherService: WeatherService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DayWeather[]> {
    return this.weatherService.getFiveDayForecast();
  }
}
