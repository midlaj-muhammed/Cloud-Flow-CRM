
import { supabase } from '@/integrations/supabase/client';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
};

export const sendChatMessage = async (userMessage: string, messageHistory: Message[]) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  // Filter out system messages and timestamps for the API call
  const apiMessageHistory = messageHistory
    .filter(msg => msg.role !== 'system')
    .map(msg => ({ role: msg.role, content: msg.content }));
  
  try {
    console.log('Sending message to Hugging Face Edge Function...');
    
    const { data, error } = await supabase.functions.invoke('huggingface-chat', {
      body: {
        message: userMessage,
        history: apiMessageHistory
      },
      // Add timeout to prevent long-running requests
      options: {
        timeout: 30000 // 30 seconds timeout
      }
    });
    
    if (error) {
      console.error('Edge function error:', error);
      
      // Check for quota exceeded error
      if (error.message && error.message.includes('429')) {
        throw new Error('AI service quota exceeded. Please try again later.');
      }
      
      throw new Error(error.message || 'Failed to get response from assistant');
    }
    
    console.log('Received response from Hugging Face Edge Function:', data);
    return data;
  } catch (error: any) {
    // Check if the error might be related to quota limits
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit'))) {
      throw new Error('AI service quota exceeded. Please try again later.');
    }
    
    // Add more detailed logging for debugging
    console.error('Chat API error details:', {
      message: error.message,
      status: error.status,
      stack: error.stack,
      fullError: error
    });
    
    // Provide a more specific error message based on the issue
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('Network issue when connecting to the AI service. Please check your connection and try again.');
    }
    
    if (error.message && error.message.includes('timeout')) {
      throw new Error('The AI service took too long to respond. Please try again later.');
    }
    
    throw error;
  }
};
