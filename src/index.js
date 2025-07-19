import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './system_prompt.js';
import { HTML_TEMPLATE } from './template.js';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    try {
      // Route: Homepage
      if (url.pathname === '/' && request.method === 'GET') {
        return new Response(HTML_TEMPLATE, {
          headers: {
            'Content-Type': 'text/html',
            ...corsHeaders
          }
        });
      }

      // Route: Chat endpoint
      if (url.pathname === '/chat' && request.method === 'POST') {
        return await handleChat(request, env);
      }

      // 404 for other routes
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

async function handleChat(request, env) {
  try {
    const data = await request.json();
    const messages = data.messages || [];
    
    if (!messages.length) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create conversation context
    const conversationHistory = messages.slice(-5); // Keep last 5 messages for context
    const latestMessage = messages[messages.length - 1];
    
    // Build context with system prompt and recent history
    let contextPrompt = SYSTEM_PROMPT + '\n\nRecent conversation:\n';
    conversationHistory.forEach((msg, index) => {
      const role = index % 2 === 0 ? 'User' : 'Lily';
      contextPrompt += `${role}: ${msg}\n`;
    });
    contextPrompt += `\nPlease respond to the user's latest message: "${latestMessage}"`;

    // Generate response
    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    const responseText = response.text();

    // Return response with updated history
    const updatedHistory = [...messages, responseText];
    
    return new Response(JSON.stringify({
      response: responseText,
      history: updatedHistory.slice(-10) // Keep last 10 messages
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
} 