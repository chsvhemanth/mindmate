// Placeholder for AI chat integration
// Will be replaced with actual Lovable AI integration
export const sendMessageToAI = async (
  conversationHistory: { role: string; content: string }[],
  userMessage: string
): Promise<string> => {
  // Simulate AI thinking time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Empathetic responses based on keywords
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("anxious") || lowerMessage.includes("worried")) {
    return "I hear that you're feeling anxious. It's completely normal to feel this way sometimes. Let's take a moment together - what specifically is weighing on your mind? Sharing can help lighten the load.";
  }

  if (lowerMessage.includes("sad") || lowerMessage.includes("down")) {
    return "I'm here with you during this difficult time. Feeling sad is a natural part of being human. Would you like to talk about what's making you feel this way? Sometimes expressing our feelings can help us process them.";
  }

  if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm")) {
    return "It sounds like you're dealing with a lot right now. Stress can feel overwhelming, but remember - you don't have to handle everything at once. What's the most pressing thing on your mind right now?";
  }

  if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("great")) {
    return "That's wonderful to hear! I'm so glad you're feeling positive. What's been bringing you joy lately? Celebrating our wins, no matter how small, is important.";
  }

  // Default empathetic response
  return "Thank you for sharing that with me. I'm here to listen without judgment. How does talking about this make you feel? Sometimes just expressing our thoughts can bring clarity.";
};
