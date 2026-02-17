import express from 'express';
import { addBrands, getBrands } from './brand.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

// GET /api/brands/
router.get('/', getBrands);

// POST /api/brands/
router.post('/', verifyToken, addBrands);

export default router;
