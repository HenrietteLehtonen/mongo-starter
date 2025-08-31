import express from 'express';
import {
  getSpecies,
  postSpecies,
  getSpeciesById,
  putSpecies,
  deleteSpecies,
  getSpeciesByArea,
} from '../controllers/speciesController';

const router = express.Router();

// endpoints

router.route('/').get(getSpecies).post(postSpecies);

router.route('/area').post(getSpeciesByArea);

router.route('/:id').get(getSpeciesById).put(putSpecies).delete(deleteSpecies);

export default router;
