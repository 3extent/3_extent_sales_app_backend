import express from 'express';
import { getActivitiess, addActivity, updateActivityStatus } from './activity.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

// PATCH /api/activity/:activityId/assign
router.patch('/:activityId/assign', verifyToken, updateActivityStatus);

// GET /api/activity/
router.get('/', verifyToken, getActivitiess);

// POST /api/activity/
router.post('/', verifyToken, addActivity);


export default router;
