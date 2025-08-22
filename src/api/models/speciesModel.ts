import mongoose from 'mongoose';
import {Species} from '../../types/DBTypes';

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

export default mongoose.model<Species>('Species', speciesSchema);
