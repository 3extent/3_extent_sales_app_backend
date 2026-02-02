import express from 'express';
import {
  getModels,
  getModelById,
  calculateDefectsPrice,
  updateModel
} from './model.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

router.get('/', getModels);
router.get('/:id', getModelById);
router.post('/calculate-defects-price', verifyToken, calculateDefectsPrice);
router.put('/:id', verifyToken, updateModel);

export default router;
