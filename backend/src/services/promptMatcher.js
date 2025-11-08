import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../data/promptCompletions.json');

// Load prompt-completion pairs from JSON file
export function loadPromptCompletions() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading prompt completions:', error);
    return [];
  }
}

// Save prompt-completion pairs to JSON file
export function savePromptCompletions(pairs) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(pairs, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving prompt completions:', error);
    return false;
  }
}

// Normalize text for comparison
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// Extract keywords from text
function extractKeywords(text) {
  const normalized = normalizeText(text);
  const words = normalized.split(' ');
  
  // Common stop words to ignore
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'am', 'im', 'feeling'
  ]);
  
  return words.filter(word => word.length > 2 && !stopWords.has(word));
}

// Calculate similarity score between two texts using keyword matching
function calculateKeywordSimilarity(text1, text2) {
  const keywords1 = new Set(extractKeywords(text1));
  const keywords2 = new Set(extractKeywords(text2));
  
  if (keywords1.size === 0 || keywords2.size === 0) {
    return 0;
  }
  
  // Calculate intersection and union
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  
  // Jaccard similarity
  return intersection.size / union.size;
}

// Calculate Levenshtein distance (edit distance)
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return matrix[len1][len2];
}

// Calculate normalized string similarity (0-1)
function calculateStringSimilarity(text1, text2) {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  if (normalized1 === normalized2) return 1;
  
  const maxLen = Math.max(normalized1.length, normalized2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(normalized1, normalized2);
  return 1 - (distance / maxLen);
}

// Combined similarity score
function calculateSimilarity(userQuestion, prompt) {
  const keywordScore = calculateKeywordSimilarity(userQuestion, prompt);
  const stringScore = calculateStringSimilarity(userQuestion, prompt);
  
  // Weighted combination (keyword matching is more important for semantic similarity)
  return (keywordScore * 0.7) + (stringScore * 0.3);
}

// Find the best matching prompt-completion pair
export function findBestMatch(userQuestion, threshold = 0.3) {
  const pairs = loadPromptCompletions();
  
  if (!pairs || pairs.length === 0) {
    return null;
  }
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const pair of pairs) {
    if (!pair.prompt || !pair.completion) {
      continue;
    }
    
    const score = calculateSimilarity(userQuestion, pair.prompt);
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        prompt: pair.prompt,
        completion: pair.completion,
        score: score
      };
    }
  }
  
  // Only return match if score is above threshold
  if (bestScore >= threshold) {
    return bestMatch;
  }
  
  return null;
}

// Update or add prompt-completion pairs
export function updatePromptCompletions(newPairs) {
  if (!Array.isArray(newPairs)) {
    throw new Error('Prompt-completion data must be an array');
  }
  
  // Validate pairs
  for (const pair of newPairs) {
    if (!pair.prompt || !pair.completion) {
      throw new Error('Each pair must have "prompt" and "completion" fields');
    }
  }
  
  const saved = savePromptCompletions(newPairs);
  if (saved) {
    return { success: true, count: newPairs.length };
  }
  
  throw new Error('Failed to save prompt-completion pairs');
}

