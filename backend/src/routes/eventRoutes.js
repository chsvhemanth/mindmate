import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEvent,
  joinEvent,
  approveJoinRequest,
  rejectJoinRequest,
  getUserEvents,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:eventId', getEvent);

// Protected routes (authentication recommended but not strictly required for flexibility)
router.post('/', createEvent);
router.post('/:eventId/join', joinEvent);
router.get('/user/:userId', getUserEvents);
router.patch('/:eventId/approve/:userId', approveJoinRequest);
router.patch('/:eventId/reject/:userId', rejectJoinRequest);
router.patch('/:eventId', updateEvent);
router.delete('/:eventId', deleteEvent);

export default router;

