import {NextFunction, Request, Response} from 'express';
import {Animal} from '../../types/DBTypes';
import {MessageResponse} from '../../types/Messages';
import CustomError from '../../classes/CustomError';
import animalModel from '../models/animalModel';

type DBMessageResponse = MessageResponse & {
  data: Animal;
};

// GET

// get all
const getAllAnimals = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    res.json(
      await animalModel
        .find()
        .select('-__v')
        .populate({
          path: 'species',
          select: '-__v',
          populate: {path: 'category', select: '-__v'},
        }),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// hae yksittäinen
const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel
      .findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {path: 'category', select: '-__v'},
      });
    // typequard !
    if (!animal) {
      next(new CustomError('Animal not found', 404));
      return;
    }
    res.json(animal);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// elukat lajin mukaan
const getAnimalBySpecies = async (
  req: Request<{species_name: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel.findBySpecies(req.params.species_name);
    res.json(animal);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// POST
const postAnimal = async (
  req: Request<{}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newAnimal = new animalModel(req.body);
    const savedAnimal = await newAnimal.save();

    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// PUT

const putAnimal = async (
  req: Request<{id: string}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedAnimal = await animalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}, // palauttaa muokatun eläimen
    );

    if (!updatedAnimal) {
      next(new CustomError('Animal not found', 404));
      return;
    }

    res.json({
      message: 'Animal updated',
      data: updatedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// DELETE
const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedAnimal = await animalModel.findByIdAndDelete(req.params.id);

    if (!deletedAnimal) {
      next(new CustomError('Animal not found', 404));
      return;
    }

    res.json({
      message: 'Animal deleted',
      data: deletedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsByBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;

    // find
    // const animals = await animalModel.find()
    res.json(
      await animalModel
        .find({
          location: {
            $geoWithin: {
              $box: [topRight.split(','), bottomLeft.split(',')],
            },
          },
        })
        .select('-__v')
        .populate({
          path: 'species',
          select: '-__v',
          populate: {path: 'category', select: '-__v'},
        }),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  getAllAnimals,
  getAnimal,
  postAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsByBox,
  getAnimalBySpecies,
};
