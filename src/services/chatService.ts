
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
  
  const { data, error } = await supabase.functions.invoke('chat-ai', {
    body: {
      message: userMessage,
      history: apiMessageHistory
    }
  });
  
  if (error) {
    throw new Error(error.message || 'Failed to get response from assistant');
  }
  
  return data;
};
