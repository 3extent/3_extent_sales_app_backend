import express from 'express';
import { getDefects } from './defect.controller.mjs';

const router = express.Router();

// GET /api/defects/
router.get('/', getDefects);

export default router;
