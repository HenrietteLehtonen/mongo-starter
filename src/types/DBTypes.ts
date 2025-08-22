import {Types} from 'mongoose';
import {Point} from 'geojson';

type Animal = {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId;
  location: Point;
};

type Species = {
  species_name: string;
  image: string;
  category: Types.ObjectId;
  location: Point;
};

type Category = {
  category_name: string;
};

export {Animal, Species, Category};
