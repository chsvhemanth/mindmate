// Content filtering utilities

// Common profanity words (add more as needed)
const PROFANITY_WORDS = [
  'fuck', 'fucking', 'fucked', 'fucker',
  'shit', 'shitting', 'shitted',
  'damn', 'damned',
  'hell',
  'ass', 'asshole',
  'bitch', 'bitches',
  'bastard',
  'crap',
  'piss', 'pissing',
  'dick', 'dicks',
  'cock',
  'pussy',
  'slut',
  'whore',
  // Add more as needed
];

// Mental health related keywords
const MENTAL_HEALTH_KEYWORDS = [
  // Emotions
  'anxiety', 'anxious', 'worry', 'worried', 'stress', 'stressed', 'depression', 'depressed',
  'sad', 'sadness', 'happy', 'happiness', 'angry', 'anger', 'frustrated', 'frustration',
  'lonely', 'loneliness', 'overwhelmed', 'overwhelm', 'tired', 'exhausted', 'energetic',
  'calm', 'peaceful', 'nervous', 'scared', 'afraid', 'fear', 'panic', 'panicked',
  'confused', 'confusion', 'lost', 'hopeless', 'hopeful', 'motivated', 'unmotivated',
  
  // Mental health conditions
  'ptsd', 'trauma', 'traumatic', 'ocd', 'adhd', 'bipolar', 'schizophrenia',
  'eating disorder', 'anorexia', 'bulimia', 'addiction', 'substance abuse',
  'grief', 'mourning', 'loss', 'bereavement',
  
  // Therapy and support
  'therapy', 'therapist', 'counseling', 'counselor', 'psychologist', 'psychiatrist',
  'mental health', 'wellness', 'wellbeing', 'self-care', 'self care',
  'coping', 'cope', 'healing', 'heal', 'recovery', 'recover',
  'support', 'help', 'struggling', 'struggle', 'difficult', 'difficulty',
  
  // Relationships and social
  'relationship', 'relationships', 'family', 'friend', 'friends', 'social',
  'lonely', 'isolated', 'connection', 'connect', 'communication', 'communicate',
  'conflict', 'fight', 'argue', 'argument', 'breakup', 'divorce',
  
  // Work and life
  'work', 'job', 'career', 'boss', 'colleague', 'workplace', 'pressure',
  'school', 'study', 'exam', 'test', 'academic', 'student',
  'life', 'living', 'purpose', 'meaning', 'goal', 'goals', 'future',
  
  // Physical and mental connection
  'sleep', 'insomnia', 'nightmare', 'dream', 'appetite', 'eating',
  'exercise', 'fitness', 'health', 'physical', 'body', 'mind',
  
  // Coping mechanisms
  'meditation', 'mindfulness', 'breathing', 'breathe', 'relax', 'relaxation',
  'yoga', 'exercise', 'walk', 'run', 'journal', 'journaling',
  
  // General mental health phrases
  'feel', 'feeling', 'feelings', 'emotion', 'emotions', 'emotional',
  'think', 'thinking', 'thought', 'thoughts', 'mind', 'mental',
  'mood', 'moods', 'state', 'state of mind',
];

// Topics that are NOT mental health related
const OFF_TOPIC_KEYWORDS = [
  'recipe', 'cooking', 'food recipe', 'how to cook',
  'sports', 'football', 'basketball', 'soccer', 'game', 'gaming', 'video game',
  'movie', 'movies', 'film', 'cinema', 'tv show', 'television',
  'weather', 'temperature', 'rain', 'snow',
  'politics', 'political', 'election', 'president', 'government',
  'technology', 'computer', 'programming', 'code', 'software', 'app',
  'shopping', 'buy', 'purchase', 'product', 'price',
  'travel', 'vacation', 'trip', 'hotel', 'flight',
  'news', 'current events', 'headlines',
  'joke', 'funny', 'humor', 'comedy', 'entertainment',
];

/**
 * Check if message contains profanity
 * @param {string} message - The message to check
 * @returns {boolean} - True if profanity is detected
 */
export function containsProfanity(message) {
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage.split(/\s+/);
  
  // Check for profanity words
  for (const word of words) {
    // Remove punctuation for comparison
    const cleanWord = word.replace(/[^\w]/g, '');
    if (PROFANITY_WORDS.includes(cleanWord)) {
      return true;
    }
  }
  
  // Check for profanity in the full message (handles cases with punctuation)
  for (const profanity of PROFANITY_WORDS) {
    if (lowerMessage.includes(profanity)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if message is related to mental health
 * @param {string} message - The message to check
 * @returns {boolean} - True if message is mental health related
 */
export function isMentalHealthRelated(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for mental health keywords
  for (const keyword of MENTAL_HEALTH_KEYWORDS) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  // Check for common mental health question patterns
  const mentalHealthPatterns = [
    /how (do|can) i (feel|deal|cope|handle|manage)/i,
    /i (feel|am feeling|feel like)/i,
    /i'm (feeling|struggling|having|going through)/i,
    /i (have|am|was) (anxiety|depression|stress|trauma)/i,
    /(help|support) (me|with)/i,
    /(therapy|therapist|counseling)/i,
    /(mental health|wellness|wellbeing)/i,
  ];
  
  for (const pattern of mentalHealthPatterns) {
    if (pattern.test(message)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if message is clearly off-topic
 * @param {string} message - The message to check
 * @returns {boolean} - True if message is off-topic
 */
export function isOffTopic(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for off-topic keywords
  for (const keyword of OFF_TOPIC_KEYWORDS) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      // But allow if it's in a mental health context
      // e.g., "I'm stressed about work" should be allowed even though it has "work"
      const contextCheck = lowerMessage.match(new RegExp(`\\b${keyword}\\b.*(feel|stress|anxiety|depression|help|struggle|difficult)`, 'i'));
      if (!contextCheck) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Validate message content
 * @param {string} message - The message to validate
 * @returns {object} - { valid: boolean, reason: string }
 */
export function validateMessage(message) {
  if (!message || !message.trim()) {
    return { valid: false, reason: 'Message is empty' };
  }
  
  // Check for profanity
  if (containsProfanity(message)) {
    return { 
      valid: false, 
      reason: 'I\'m a mental health-focused AI, and I prefer to keep our conversations respectful and supportive. Could you please rephrase your message without profanity? I\'m here to help with mental health concerns.' 
    };
  }
  
  // Check if it's off-topic
  if (isOffTopic(message)) {
    return { 
      valid: false, 
      reason: 'I\'m a specialized AI focused exclusively on mental health and wellness. I can help you with emotions, stress, anxiety, depression, relationships, therapy, coping strategies, and other mental health topics. Could you please ask me something related to mental health or emotional wellbeing?' 
    };
  }
  
  // Check if it's mental health related
  if (!isMentalHealthRelated(message)) {
    return { 
      valid: false, 
      reason: 'I\'m a mental health-focused AI assistant. I\'m here to help with emotions, stress, anxiety, depression, relationships, coping strategies, therapy, and wellness. Please share something related to your mental health or emotional wellbeing, and I\'ll be happy to help.' 
    };
  }
  
  return { valid: true, reason: '' };
}

