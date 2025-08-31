import {NextFunction, Request, Response} from 'express';
import {Species} from '../../types/DBTypes';
import {MessageResponse} from '../../types/Messages';
import CustomError from '../../classes/CustomError';
import speciesModel from '../models/speciesModel';
import {Polygon} from 'geojson';

type DBMessageResponse = MessageResponse & {
  data: Species;
};

// GET

// get all
const getSpecies = async (
  req: Request,
  res: Response<Species[]>, // palauttaa taulukon
  next: NextFunction,
) => {
  try {
    res.json(
      await speciesModel.find().select('-__v').populate({
        path: 'category',
        select: '-__v',
      }),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// hae yksittäinen
const getSpeciesById = async (
  req: Request<{id: string}>,
  res: Response<Species>,
  next: NextFunction,
) => {
  try {
    const Species = await speciesModel.findById(req.params.id);
    // typequard !
    if (!Species) {
      next(new CustomError('Species not found', 404));
      return;
    }
    res.json(Species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// POST
const postSpecies = async (
  req: Request<{}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newSpecies = new speciesModel(req.body);
    const savedSpecies = await newSpecies.save();

    res.status(201).json({
      message: 'Species created',
      data: savedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get animals within a certain polygon area
const getSpeciesByArea = async (
  req: Request<{}, {}, {polygon: Polygon}>,
  res: Response<Species[]>,
  next: NextFunction,
) => {
  try {
    const polygon: Polygon = req.body.polygon;
    const species = await speciesModel.findByArea(polygon);
    res.status(200).json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// PUT

const putSpecies = async (
  req: Request<{id: string}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedSpecies = await speciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}, // palauttaa muokatun kategorian
    );

    if (!updatedSpecies) {
      next(new CustomError('Species not found', 404));
      return;
    }

    res.json({
      message: 'Species updated',
      data: updatedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// DELETE
const deleteSpecies = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.findByIdAndDelete(req.params.id);
    if (!species) {
      return next(new CustomError('Species not found', 404));
    }
    res.status(200).json({
      message: 'Species deleted',
      data: species,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  getSpecies,
  getSpeciesById,
  postSpecies,
  putSpecies,
  deleteSpecies,
  getSpeciesByArea,
};
