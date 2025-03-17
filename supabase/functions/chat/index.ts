
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from 'https://esm.sh/openai@4.17.5';

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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

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
    
    // Define the initial system message
    const systemMessage = {
      role: 'system',
      content: `You are a helpful sales assistant for a CRM application. 
      You can help with sales strategies, customer relationship management, 
      and provide advice on deals, contacts, and tasks. Be concise, professional, and helpful. 
      Your name is SalesGPT.`
    };
    
    // Prepare conversation for OpenAI
    const conversation = [
      systemMessage,
      ...history,
      { role: 'user', content: message }
    ];
    
    // Call OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversation as any,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const responseMessage = chatCompletion.choices[0].message.content;
    
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
