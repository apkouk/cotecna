export class DayWeather {
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

  static createEmptyObject(): DayWeather {
    return new DayWeather(new Date(), "", "", "", 0);
  }
}
