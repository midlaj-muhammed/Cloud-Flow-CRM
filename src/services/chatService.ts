
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
    const { data, error } = await supabase.functions.invoke('huggingface-chat', {
      body: {
        message: userMessage,
        history: apiMessageHistory
      }
    });
    
    if (error) {
      // Check for quota exceeded error
      if (error.message && error.message.includes('429')) {
        throw new Error('AI service quota exceeded. Please try again later.');
      }
      throw new Error(error.message || 'Failed to get response from assistant');
    }
    
    return data;
  } catch (error: any) {
    // Check if the error might be related to quota limits
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit'))) {
      throw new Error('AI service quota exceeded. Please try again later.');
    }
    
    // Handle other errors
    console.error('Chat API error:', error);
    throw error;
  }
};
