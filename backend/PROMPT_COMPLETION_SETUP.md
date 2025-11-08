# Prompt-Completion Matching Setup

This feature allows the backend to use a JSON array of prompt-completion pairs to provide responses that match similar user questions.

## How It Works

1. **Prompt Matching**: When a user sends a message, the system searches through stored prompt-completion pairs to find the most similar prompt.
2. **Response Generation**:
   - **High Confidence (≥60% similarity)**: Returns the matched completion directly
   - **Moderate Confidence (30-60% similarity)**: Uses the matched completion as context for Groq to generate an enhanced, personalized response
   - **Low Confidence (<30% similarity)**: Falls back to standard Groq response

## API Endpoints

### 1. Update Prompt-Completion Pairs
**POST** `/api/chats/ai/prompts`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "pairs": [
    {
      "prompt": "I'm feeling anxious about my job interview",
      "completion": "It's completely normal to feel anxious before a job interview. Many people experience this. Try taking some deep breaths and remember that you've prepared for this. Focus on your strengths and what you can bring to the role. You've got this!"
    },
    {
      "prompt": "I'm struggling with stress at work",
      "completion": "Work stress can be overwhelming. It's important to recognize when you're feeling this way. Consider taking regular breaks, practicing mindfulness, or talking to your supervisor about your workload. Remember, your well-being matters."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully updated 2 prompt-completion pairs",
  "data": {
    "success": true,
    "count": 2
  }
}
```

### 2. Get All Prompt-Completion Pairs
**GET** `/api/chats/ai/prompts`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "prompt": "I'm feeling anxious about my job interview",
      "completion": "It's completely normal to feel anxious..."
    },
    {
      "prompt": "I'm struggling with stress at work",
      "completion": "Work stress can be overwhelming..."
    }
  ]
}
```

## Usage Examples

### Using cURL

#### Update Prompt-Completion Pairs
```bash
curl -X POST http://localhost:5000/api/chats/ai/prompts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pairs": [
      {
        "prompt": "I feel sad today",
        "completion": "I\'m sorry to hear you\'re feeling sad. It\'s okay to have these feelings. Would you like to talk about what might be causing this sadness?"
      }
    ]
  }'
```

#### Get All Pairs
```bash
curl -X GET http://localhost:5000/api/chats/ai/prompts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Node.js

```javascript
const axios = require('axios');

const token = 'YOUR_JWT_TOKEN';
const apiUrl = 'http://localhost:5000/api/chats/ai/prompts';

// Update prompt-completion pairs
async function updatePromptCompletions(pairs) {
  try {
    const response = await axios.post(
      apiUrl,
      { pairs },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Example usage
const pairs = [
  {
    prompt: "I'm feeling overwhelmed",
    completion: "Feeling overwhelmed is understandable. Let's break things down into smaller, manageable steps. What's the most pressing thing on your mind right now?"
  },
  {
    prompt: "I can't sleep at night",
    completion: "Sleep issues can be really challenging. Have you tried establishing a bedtime routine? Things like avoiding screens before bed, reading, or relaxation techniques can help. What usually goes through your mind when you're trying to sleep?"
  }
];

updatePromptCompletions(pairs);
```

### Direct File Upload

You can also directly edit the JSON file at:
```
backend/src/data/promptCompletions.json
```

The file should have this format:
```json
[
  {
    "prompt": "User question or prompt",
    "completion": "AI response to that prompt"
  },
  {
    "prompt": "Another user question",
    "completion": "Another AI response"
  }
]
```

**Note**: After editing the file directly, restart the backend server for changes to take effect.

## Matching Algorithm

The system uses a combination of:
1. **Keyword Matching** (70% weight): Extracts meaningful keywords and calculates Jaccard similarity
2. **String Similarity** (30% weight): Uses Levenshtein distance for fuzzy matching

This approach balances semantic understanding (keyword matching) with exact phrase matching (string similarity).

## Best Practices

1. **Variety in Prompts**: Include variations of the same question (e.g., "I'm anxious", "I feel anxious", "anxiety is bothering me")
2. **Natural Language**: Write prompts as users would naturally phrase them
3. **Comprehensive Coverage**: Cover common topics and questions your users might ask
4. **Regular Updates**: Update the pairs based on actual user interactions
5. **Quality Responses**: Ensure completions are empathetic, helpful, and aligned with your therapist persona

## Data Storage

- **Location**: `backend/src/data/promptCompletions.json`
- **Format**: JSON array of objects with `prompt` and `completion` fields
- **Backup**: Consider backing up this file regularly, especially after updates

## Troubleshooting

### Matching not working?
- Check that the JSON file is valid JSON
- Verify that prompts are similar enough to user questions
- Lower the threshold if needed (currently 0.3 = 30% similarity minimum)

### Response not using matches?
- Check server logs for matching scores
- Ensure prompt-completion pairs are loaded (check GET endpoint)
- Verify similarity threshold is appropriate for your data

### Performance issues?
- Large datasets (>1000 pairs) may slow down matching
- Consider organizing pairs by category for faster lookup
- The current implementation is O(n) where n is the number of pairs

