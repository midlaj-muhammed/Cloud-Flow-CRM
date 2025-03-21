
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
};

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const formatTimestamp = (timestamp: Date) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatMessage = ({ message, isLoading }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isAssistant 
            ? 'bg-gray-100 dark:bg-gray-800' 
            : 'bg-cloudflow-blue-500 text-white'
        }`}
      >
        {isAssistant && (
          <div className="flex items-center mb-1">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>AI</AvatarFallback>
              <AvatarImage src="/placeholder.svg" />
            </Avatar>
            <span className="text-xs font-medium">CloudGPT</span>
            {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        {message.timestamp && (
          <div className={`text-xs mt-1 ${isAssistant ? 'text-gray-500' : 'text-gray-200'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};
