import express from 'express';
import { getActivitiess, addActivity } from './activity.controller.mjs';

const router = express.Router();

// GET /api/activity/
router.get('/', getActivitiess);

// POST /api/activity/
router.get('/', addActivity);

export default router;
