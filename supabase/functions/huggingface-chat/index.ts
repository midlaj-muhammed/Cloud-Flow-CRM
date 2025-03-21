
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN') || '';
    
    if (!huggingFaceToken) {
      return new Response(
        JSON.stringify({ error: 'Hugging Face API token is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Get the request body
    const { message, history = [] } = await req.json() as RequestBody;
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Format conversation for Hugging Face
    let conversationText = "";
    
    // Add history to conversation
    for (const msg of history) {
      if (msg.role === 'user') {
        conversationText += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationText += `Assistant: ${msg.content}\n`;
      }
    }
    
    // Add current message
    conversationText += `User: ${message}\nAssistant:`;
    
    console.log('Calling Hugging Face with conversation:', conversationText);
    
    // Call Hugging Face Inference API
    // Using a free conversational model - Mistral 7B Instruct
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: conversationText,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      
      // Handle rate limiting specifically
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      
      throw new Error(`Hugging Face API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    // Extract the generated text
    let responseMessage = data[0]?.generated_text || "I couldn't generate a response. Please try again.";
    
    // Clean up the response if needed
    responseMessage = responseMessage.trim();
    
    console.log('Hugging Face response:', responseMessage);
    
    // Return the AI response
    return new Response(
      JSON.stringify({ 
        message: responseMessage,
        conversation: [
          ...history,
          { role: 'user', content: message },
          { role: 'assistant', content: responseMessage }
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
