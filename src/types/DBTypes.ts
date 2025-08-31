import {Types, Model} from 'mongoose';
import {Point, Polygon} from 'geojson';

type Animal = {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId | Species;
  location: Point;
};

type Species = {
  species_name: string;
  image: string;
  category: Types.ObjectId | Category;
  location: Point;
};

type Category = {
  category_name: string;
};

type AnimalModel = Model<Animal> & {
  findBySpecies: (species_name: string) => Promise<Animal[]>;
};

type SpeciesModel = Model<Species> & {
  findByArea: (polygon: Polygon) => Promise<Species[]>;
};

export {Animal, Species, Category, AnimalModel, SpeciesModel};
