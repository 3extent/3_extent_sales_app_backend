import express from 'express';
import { getActivitiess, addActivity, updateActivityStatus } from './activity.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

// GET /api/activity/
router.get('/', verifyToken, getActivitiess);

// POST /api/activity/
router.post('/', verifyToken, addActivity);

// PATCH /api/activity/:activityId/assign
router.post('/:activityId/assign', verifyToken, updateActivityStatus);

export default router;
