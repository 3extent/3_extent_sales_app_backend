import express from 'express';
import { getAllPartners } from './partner.controller.mjs';
import { verifyToken } from '../../middlewares/authMiddleware.mjs';

const router = express.Router();

// GET /api/partners
router.get('/', verifyToken, getAllPartners);


export default router;
