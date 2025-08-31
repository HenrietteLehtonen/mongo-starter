import express, {Request, Response} from 'express';
import {MessageResponse} from '../types/Messages';
import categoryRoute from './routes/categoryRoute';
import speciesRoute from './routes/speciesRoute';
import animalRoute from './routes/animalRoute';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req: Request, res: Response) => {
  res.json({
    message: 'api v1',
  });
});

//
router.use('/categories', categoryRoute); // api/v1/categories
router.use('/species', speciesRoute); // api/v1/species
router.use('/animals', animalRoute); // api/v1/animals

export default router;
