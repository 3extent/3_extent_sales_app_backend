import express from 'express';
import { getAllPartners } from './partner.controller.mjs';

const router = express.Router();

// GET /api/partners
router.post('/', getAllPartners);


export default router;
