import express from 'express';
import {
  getModels,
  getModelById,
  calculateDefectsPrice,
  updateModel
} from './model.controller.mjs';

const router = express.Router();

router.get('/', getModels);
router.get('/:id', getModelById);
router.post('/calculate-defects-price', calculateDefectsPrice);
router.put('/:id', updateModel);

export default router;
