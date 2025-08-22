import mongoose from 'mongoose';
import {Category} from '../../types/DBTypes';

// uus schema -> <> sisään tyyppi
const categorySchema = new mongoose.Schema<Category>({
  // jos monta param {tee obj.}
  category_name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
  },
});

export default mongoose.model<Category>('Category', categorySchema);
