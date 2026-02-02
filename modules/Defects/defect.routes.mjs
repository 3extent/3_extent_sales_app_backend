import express from 'express';
import { getDefects } from './defect.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

// GET /api/defects/
router.get('/', verifyToken, getDefects);

export default router;
