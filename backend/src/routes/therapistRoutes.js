import express from 'express';
import {
  createTherapist,
  getAllTherapists,
  findNearbyTherapists,
  getTherapist,
  updateTherapist,
  deleteTherapist
} from '../controllers/therapistController.js';

const router = express.Router();

// Public routes
router.get('/', getAllTherapists);
router.get('/nearby', findNearbyTherapists);
router.get('/:therapistId', getTherapist);

// Admin routes (for creating/managing therapists)
router.post('/', createTherapist);
router.patch('/:therapistId', updateTherapist);
router.delete('/:therapistId', deleteTherapist);

export default router;

