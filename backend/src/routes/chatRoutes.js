import express from 'express';
import {
  createChat,
  getUserChats,
  getChat,
  addMessage,
  deleteChat,
  updateChatTitle,
  getAIResponse,
  updatePromptCompletions,
  getPromptCompletions
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createChat);
router.get('/user/:userId', getUserChats);
router.get('/:chatId', getChat);
router.post('/:chatId/messages', addMessage);
router.delete('/:chatId', deleteChat);
router.patch('/:chatId/title', updateChatTitle);
router.post('/ai/response', authenticate, getAIResponse);

// Prompt-completion management routes
router.get('/ai/prompts', authenticate, getPromptCompletions);
router.post('/ai/prompts', authenticate, updatePromptCompletions);

export default router;

