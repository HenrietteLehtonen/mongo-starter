import express from 'express';
import {
  getAllAnimals,
  postAnimal,
  getAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsByBox,
  getAnimalBySpecies,
} from '../controllers/animalController';

const router = express.Router();

// endpoints

router.route('/').get(getAllAnimals).post(postAnimal);

router.route('/location').get(getAnimalsByBox);

router.route('/species/:species_name').get(getAnimalBySpecies);

router.route('/:id').get(getAnimal).put(putAnimal).delete(deleteAnimal);

export default router;
