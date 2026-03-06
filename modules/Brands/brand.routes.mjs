import express from 'express';
import { addBrands, getBrands, getBrandsNames } from './brand.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

// GET /api/brands/
router.get('/', getBrands);

// GET /api/brands/list
router.get('/list', getBrandsNames);

// POST /api/brands/
router.post('/', verifyToken, addBrands);

export default router;
