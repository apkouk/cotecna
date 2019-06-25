import { City } from "./City";

export class WeatherInfo {
  date: Date;
  description: string;
  icon: string;
  main: string;
  temperature: number;


  constructor(date: Date, description: string, icon: string, main: string, temperature: number) {
    this.date = date;
    this.description = description;
    this.icon = icon;
    this.main = main;
    this.temperature = temperature;
  }

  static createEmptyObject(): WeatherInfo {
    return new WeatherInfo(new Date(), "", "", "", 0);
  }
}

