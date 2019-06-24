import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayWeather } from '../../models/DayWeather';
import { Service } from '../service.base';

@Injectable()

export class WeatherService extends Service {

  //Default is Barcelona
  public cityId: string = "3128760";

  constructor(http: HttpClient) {
    super(http, '/api/weather/');
  }

  public getFiveDayForecast(): Observable<DayWeather[]> {
    return this.http.get<DayWeather[]>(this.baseUrl + this.cityId);
  };
}

