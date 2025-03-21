
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
      console.error('Hugging Face API token is missing');
      return new Response(
        JSON.stringify({ error: 'Hugging Face API token is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Authorization header is missing');
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Unauthorized user or error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Get the request body
    const requestData = await req.json();
    const { message, history = [] } = requestData as RequestBody;
    
    console.log('Request received:', { userId: user.id, messageLength: message?.length, historyLength: history?.length });
    
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
    const huggingFaceResponse = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
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
    
    if (!huggingFaceResponse.ok) {
      const errorStatus = huggingFaceResponse.status;
      const errorText = await huggingFaceResponse.text();
      console.error(`Hugging Face API error (${errorStatus}):`, errorText);
      
      // Handle rate limiting specifically
      if (errorStatus === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      
      throw new Error(`Hugging Face API error: ${errorStatus} ${errorText}`);
    }
    
    const data = await huggingFaceResponse.json();
    
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
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
