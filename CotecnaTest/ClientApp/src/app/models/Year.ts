export class Year {
  value: string;
  viewValue: string;

  constructor(value: number, viewValue: number) {
    this.value = value.toString();
    this.viewValue = viewValue.toString();
  }

}