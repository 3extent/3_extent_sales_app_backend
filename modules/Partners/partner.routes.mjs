import express from 'express';
import { getAllPartners } from './partner.controller.mjs';

const router = express.Router();

// GET /api/partners
router.get('/', getAllPartners);


export default router;
