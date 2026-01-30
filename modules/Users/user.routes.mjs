import express from 'express';
import { loginUser, sendOtp } from './user.controller.mjs';

const router = express.Router();

// POST /api/users/login
router.post('/login', loginUser);

//POST /api/users/send
router.post('/send', sendOtp);


export default router;
