import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayWeather } from '../../models/DayWeather';
import { Service } from '../service.base';

@Injectable()

export class WeatherService extends Service {

  //Default is Barcelona
  public zipCode: string; 
  public posLon: number;
  public posLat: number;

  constructor(http: HttpClient) {
    super(http, '/api/weather/');
    this.zipCode = "36201";
  }

  public getWeatherByZipCode(): Observable<DayWeather> {
    return this.http.get<DayWeather>(this.baseUrl + this.zipCode);
  };

  //public getWeatherByLocation(): Observable<DayWeather> {
  //  return this.http.get<DayWeather>(this.baseUrl + "lon/" + this.posLon + "/lat/" + this.posLat);
  //};
}

