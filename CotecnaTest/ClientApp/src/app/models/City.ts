import { Coord } from "./Coord";


export class City {
  id: number;
  name: string;
  country: string;
  coord: Coord;

  constructor(id: number, name: string, country: string, coord: Coord) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.coord = coord;
  }

}
