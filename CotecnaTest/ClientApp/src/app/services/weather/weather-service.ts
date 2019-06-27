import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { DayWeather } from '../../models/DayWeather';
import { Service } from '../service.base';


@Injectable()

export class WeatherService extends Service {

  //Default is Barcelona
  public zipCode: string = "36201"; 
  public posLon: number;
  public posLat: number;

  constructor(http: HttpClient) {
    super(http, '/api/weather/');
  }

  public getWeatherByZipCode(): Observable<DayWeather> {
    return this.http.get<DayWeather>(this.baseUrl + this.zipCode).map((res: DayWeather) => res);
  };

  public getWeatherByLocation(): Observable<DayWeather> {
    if (this.posLon !== undefined && this.posLat !== undefined)
      return this.http.get<DayWeather>(this.baseUrl + "?lon=" + this.posLon + "&lat=" + this.posLat).map((res: DayWeather) => res);
  };
}

