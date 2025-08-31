import mongoose from 'mongoose';
import {Species, SpeciesModel} from '../../types/DBTypes';
import {Polygon} from 'geojson';

const speciesSchema = new mongoose.Schema<Species>({
  species_name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
  },
  image: {
    type: String,
    required: true,
  },
});

// static method to find all species within a certain area by geoJson polygon

speciesSchema.statics.findByArea = function (polygon: Polygon) {
  return this.find({
    location: {
      $geoWithin: {
        $geometry: polygon,
      },
    },
  });
};

export default mongoose.model<Species, SpeciesModel>('Species', speciesSchema);
