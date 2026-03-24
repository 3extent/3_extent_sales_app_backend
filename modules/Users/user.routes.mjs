import express from 'express';
import { getAllUsers, getuserById, loginUser, sendOtp, updateUserAddress } from './user.controller.mjs';

const router = express.Router();

// POST /api/users/login
router.post('/login', loginUser);

//POST /api/users/send
router.post('/send', sendOtp);

// PUT /api/users/:id
router.put("/:id", updateUserAddress);

//GET /api/user/id
router.get('/:id', getuserById);

//GET  /api/users/
router.get('/', getAllUsers);


export default router;
