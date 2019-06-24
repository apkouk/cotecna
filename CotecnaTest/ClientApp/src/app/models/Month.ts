export class Month {
  value: number;
  locale: string;
  name: string;

  constructor(value: number, locale:string, name: number) {
    this.value = value;
    this.locale = locale;
    this.name = name.toString();
  }

}
