import express from 'express';
import {
  recordEmotion,
  getEmotionHistory,
  getEmotionStats,
  deleteEmotion
} from '../controllers/emotionController.js';

const router = express.Router();

router.post('/', recordEmotion);
router.get('/user/:userId', getEmotionHistory);
router.get('/user/:userId/stats', getEmotionStats);
router.delete('/:emotionId', deleteEmotion);

export default router;

