import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { updatePromptCompletions } from '../src/services/promptMatcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to upload prompt-completion pairs from a JSON file
 * 
 * Usage:
 *   node scripts/upload-prompt-completions.js <path-to-json-file>
 * 
 * Example:
 *   node scripts/upload-prompt-completions.js data/my-prompts.json
 */

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Error: Please provide a path to the JSON file containing prompt-completion pairs.');
    console.log('\nUsage: node scripts/upload-prompt-completions.js <path-to-json-file>');
    console.log('\nExample: node scripts/upload-prompt-completions.js data/my-prompts.json');
    process.exit(1);
  }
  
  const filePath = args[0];
  const fullPath = path.isAbsolute(filePath) 
    ? filePath 
    : path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found: ${fullPath}`);
    process.exit(1);
  }
  
  try {
    console.log(`Reading prompt-completion pairs from: ${fullPath}`);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Handle both direct arrays and objects with a 'pairs' property
    const pairs = Array.isArray(data) ? data : (data.pairs || []);
    
    if (!Array.isArray(pairs)) {
      throw new Error('Invalid JSON format. Expected an array of {prompt, completion} objects.');
    }
    
    if (pairs.length === 0) {
      console.warn('Warning: No prompt-completion pairs found in the file.');
      process.exit(0);
    }
    
    // Validate pairs
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (!pair.prompt || !pair.completion) {
        throw new Error(`Invalid pair at index ${i}. Each pair must have "prompt" and "completion" fields.`);
      }
    }
    
    console.log(`Found ${pairs.length} prompt-completion pairs.`);
    console.log('Uploading...');
    
    const result = updatePromptCompletions(pairs);
    
    if (result.success) {
      console.log(`✅ Successfully uploaded ${result.count} prompt-completion pairs!`);
      console.log(`\nData saved to: backend/src/data/promptCompletions.json`);
    } else {
      console.error('❌ Failed to upload prompt-completion pairs.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON format. Please check your file.');
    }
    process.exit(1);
  }
}

main();

