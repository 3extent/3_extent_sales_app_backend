import express from 'express';
import { getDefects } from './defect.controller.mjs';

const router = express.Router();

// GET /api/brands/
router.get('/', getBrands);

// POST /api/brands/
router.get('/', addBrands);

export default router;
