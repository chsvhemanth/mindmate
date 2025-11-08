// Simple rule-based emotion analysis
// In production, this would use Hugging Face transformers
export const analyzeEmotion = async (text: string): Promise<string> => {
  const lowerText = text.toLowerCase();

  // Keywords for different emotions
  const emotionKeywords = {
    happy: ["happy", "joy", "great", "wonderful", "excited", "good", "better", "amazing"],
    sad: ["sad", "depressed", "down", "lonely", "cry", "miss", "hurt", "upset"],
    angry: ["angry", "mad", "furious", "hate", "annoyed", "frustrated", "irritated"],
    anxious: ["anxious", "worried", "nervous", "scared", "fear", "panic", "stress"],
    calm: ["calm", "peaceful", "relaxed", "fine", "okay", "alright"],
  };

  // Count matches for each emotion
  let scores: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    calm: 0,
  };

  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        scores[emotion]++;
      }
    });
  });

  // Find emotion with highest score
  const dominant = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  // Default to calm if no clear emotion
  return scores[dominant] > 0 ? dominant : "calm";
};
