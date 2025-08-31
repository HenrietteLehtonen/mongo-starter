import express from 'express';
import {
  getAllCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = express.Router();

// endpoints

router.route('/').get(getAllCategories).post(postCategory);

router.route('/:id').get(getCategory).put(putCategory).delete(deleteCategory);

export default router;
