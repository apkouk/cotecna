import { City } from "./City";
import { WeatherInfo } from "./WeatherInfo";

export class DayWeather {
  weather: WeatherInfo[];
  city: City;


  constructor(weatherInfo: WeatherInfo[], city: City) {
    this.weather = weatherInfo;
    this.city = city;
  }

  static createEmptyObject(): DayWeather {
    return new DayWeather(undefined, undefined);
  }
}



