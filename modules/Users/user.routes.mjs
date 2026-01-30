import express from 'express';
import { loginUser } from './user.controller.mjs';

const router = express.Router();

// POST /api/users/login
router.post('/login', loginUser);

export default router;
