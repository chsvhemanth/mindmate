# Quick Start: Prompt-Completion Matching

This guide will help you quickly set up and use the prompt-completion matching feature.

## What You Need

- A JSON file with prompt-completion pairs in this format:
```json
[
  {
    "prompt": "User question or statement",
    "completion": "AI response to that prompt"
  },
  {
    "prompt": "Another user question",
    "completion": "Another AI response"
  }
]
```

## Method 1: Using the Upload Script (Recommended)

1. **Save your JSON data** to a file (e.g., `my-prompts.json`)

2. **Run the upload script**:
   ```bash
   cd backend
   node scripts/upload-prompt-completions.js path/to/your/prompts.json
   ```

   Example:
   ```bash
   node scripts/upload-prompt-completions.js ../my-prompts.json
   ```

3. **Restart your backend server** (if it's running):
   ```bash
   npm run dev
   ```

## Method 2: Using the API Endpoint

1. **Start your backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Get your JWT token** (from logging in to your app)

3. **Send a POST request** to upload your data:

   Using cURL:
   ```bash
   curl -X POST http://localhost:5000/api/chats/ai/prompts \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d @your-prompts.json
   ```

   Or using a tool like Postman:
   - URL: `POST http://localhost:5000/api/chats/ai/prompts`
   - Headers: 
     - `Authorization: Bearer YOUR_JWT_TOKEN`
     - `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "pairs": [
         {
           "prompt": "Your prompt here",
           "completion": "Your completion here"
         }
       ]
     }
     ```

## Method 3: Direct File Edit

1. **Edit the file directly**:
   ```
   backend/src/data/promptCompletions.json
   ```

2. **Paste your JSON array** into the file (replace the empty array `[]`)

3. **Save the file**

4. **Restart your backend server**

## Verify It's Working

1. **Check that your data was loaded**:
   ```bash
   curl -X GET http://localhost:5000/api/chats/ai/prompts \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Test in your app**: Send a message similar to one of your prompts and check if the response matches your completion (or is enhanced based on it).

3. **Check server logs**: When a match is found, you'll see logs like:
   ```
   [AI] Using matched response (score: 0.75)
   ```
   or
   ```
   [AI] Using matched response with enhancement (score: 0.45)
   ```

## Example JSON Format

```json
[
  {
    "prompt": "I'm feeling anxious about my job interview",
    "completion": "It's completely normal to feel anxious before a job interview. Many people experience this. Try taking some deep breaths and remember that you've prepared for this. Focus on your strengths and what you can bring to the role. You've got this!"
  },
  {
    "prompt": "I'm struggling with stress at work",
    "completion": "Work stress can be overwhelming. It's important to recognize when you're feeling this way. Consider taking regular breaks, practicing mindfulness, or talking to your supervisor about your workload. Remember, your well-being matters."
  }
]
```

## How Matching Works

- **High Match (≥60% similarity)**: Returns your completion directly
- **Moderate Match (30-60% similarity)**: Uses your completion as a guide, but enhances it with Groq AI to personalize it
- **Low Match (<30% similarity)**: Uses standard Groq AI response

## Troubleshooting

**Problem**: My prompts aren't being matched
- **Solution**: Make sure your prompts are similar to how users actually phrase questions. Include variations (e.g., "I'm anxious", "I feel anxious", "anxiety is bothering me")

**Problem**: Script says "File not found"
- **Solution**: Use the full path or make sure you're in the backend directory when running the script

**Problem**: API returns "Unauthorized"
- **Solution**: Make sure you're including a valid JWT token in the Authorization header

**Problem**: No matches found
- **Solution**: Check that your JSON file is valid and contains the `prompt` and `completion` fields. Lower the similarity threshold if needed (currently 30% minimum).

## Next Steps

- See `PROMPT_COMPLETION_SETUP.md` for detailed documentation
- Test different prompt variations to improve matching
- Monitor server logs to see matching scores
- Update your prompts based on actual user interactions

