import Chat from '../models/Chat.js';
import Emotion from '../models/Emotion.js';
import Groq from 'groq-sdk';
import { 
  findBestMatch, 
  loadPromptCompletions, 
  updatePromptCompletions as updatePairs 
} from '../services/promptMatcher.js';

// Create a new chat session
export const createChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    const chat = new Chat({
      userId,
      title: title || 'New Conversation',
      messages: []
    });

    await chat.save();
    res.status(201).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title messages createdAt updatedAt')
      .limit(50);

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a specific chat
export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add a message to a chat
export const addMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, role, emotion } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const newMessage = {
      content,
      role: role || 'user',
      emotion: emotion || 'neutral',
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    
    // Update emotion summary
    chat.updateEmotionSummary();
    chat.updatedAt = new Date();

    await chat.save();

    // If it's a user message with emotion, record it
    if (role === 'user' && emotion) {
      await Emotion.create({
        userId: chat.userId,
        emotion,
        context: content.substring(0, 100), // Store first 100 chars as context
        date: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: newMessage,
        chat: chat
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update chat title
export const updateChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { title, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get AI response using Groq with prompt-completion matching
export const getAIResponse = async (req, res) => {
  try {
    const { message, conversationHistory = [], emotion } = req.body;
    const { userId } = req; // From auth middleware

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Try to find a matching prompt-completion pair
    const match = findBestMatch(message, 0.3); // Threshold: 30% similarity minimum
    
    let aiResponse;

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    if (match && match.score >= 0.6) {
      // High confidence match (>= 60%) - use the completion directly
      console.log(`[AI] Using matched response (score: ${match.score.toFixed(2)})`);
      aiResponse = match.completion;
    } else if (match && match.score >= 0.3) {
      // Moderate confidence match (30-60%) - use completion as context for Groq
      console.log(`[AI] Using matched response with enhancement (score: ${match.score.toFixed(2)})`);
      
      const systemPrompt = `You are a compassionate, empathetic AI therapist named MindMate. 
A similar question was asked before, and this was the response: "${match.completion}"

Use this as a guide, but adapt it naturally to the current user's question: "${message}"
- Keep the same tone and style as the guide response
- Make it feel natural and personalized to the current context
- Keep responses concise (2-4 sentences typically) but meaningful
- Use a warm, conversational tone

Current user emotion context: ${emotion || 'neutral'}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9
      });

      aiResponse = completion.choices[0]?.message?.content || match.completion;
    } else {
      // No good match found - use standard Groq response
      console.log('[AI] No matching prompt found, using standard Groq response');
      
      const systemPrompt = `You are a compassionate, empathetic AI therapist named MindMate. Your role is to:
- Listen actively and provide supportive, non-judgmental responses
- Help users explore their feelings and thoughts
- Offer gentle guidance and coping strategies when appropriate
- Validate emotions and create a safe space for expression
- Ask thoughtful questions to help users gain insight
- Maintain professional boundaries while being warm and understanding
- Never provide medical diagnoses or replace professional therapy
- Keep responses concise (2-4 sentences typically) but meaningful
- if required, provide a short joke or a funny story to make the user laugh
- Use a warm, conversational tone

Current user emotion context: ${emotion || 'neutral'}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9
      });

      aiResponse = completion.choices[0]?.message?.content || 
        "I'm here to listen. Could you tell me more about what you're experiencing?";
    }

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        emotion: emotion || 'neutral',
        matched: match ? { score: match.score, prompt: match.prompt } : null
      }
    });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI response'
    });
  }
};

// Update prompt-completion pairs
export const updatePromptCompletions = async (req, res) => {
  try {
    const { pairs } = req.body;

    if (!pairs || !Array.isArray(pairs)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Expected an array of {prompt, completion} pairs.'
      });
    }

    // Validate each pair
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (!pair.prompt || !pair.completion) {
        return res.status(400).json({
          success: false,
          message: `Invalid pair at index ${i}. Each pair must have "prompt" and "completion" fields.`
        });
      }
    }

    const result = updatePairs(pairs);

    res.status(200).json({
      success: true,
      message: `Successfully updated ${result.count} prompt-completion pairs`,
      data: result
    });
  } catch (error) {
    console.error('Error updating prompt completions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update prompt-completion pairs'
    });
  }
};

// Get all prompt-completion pairs
export const getPromptCompletions = async (req, res) => {
  try {
    const pairs = loadPromptCompletions();

    res.status(200).json({
      success: true,
      count: pairs.length,
      data: pairs
    });
  } catch (error) {
    console.error('Error loading prompt completions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load prompt-completion pairs'
    });
  }
};

