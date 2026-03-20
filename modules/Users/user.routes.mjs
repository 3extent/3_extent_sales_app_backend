import express from 'express';
import { loginUser, sendOtp, updateUserAddress } from './user.controller.mjs';

const router = express.Router();

// POST /api/users/login
router.post('/login', loginUser);

//POST /api/users/send
router.post('/send', sendOtp);

// PUT /api/users/:id
router.put("/:id", updateUserAddress);


export default router;
