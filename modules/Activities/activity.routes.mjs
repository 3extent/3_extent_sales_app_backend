import express from 'express';
import { getActivitiess, addActivity } from './activity.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

// GET /api/activity/
router.get('/', verifyToken, getActivitiess);

// POST /api/activity/
router.post('/', verifyToken, addActivity);

export default router;
