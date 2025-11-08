import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId', getUserProfile);
router.patch('/:userId', updateUserProfile);
router.delete('/:userId', deleteUser);

export default router;

