
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessage, Message } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { sendChatMessage } from '@/services/chatService';

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I\'m CloudGPT, powered by Hugging Face. How can I help you with your CRM tasks today?',
    timestamp: new Date()
  }]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim() || isLoading || !user) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    
    const newMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      console.log('Sending message to chat service...');
      const data = await sendChatMessage(userMessage, messages);
      console.log('Received response from chat service:', data);
      
      const botMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setApiUnavailable(false);
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Check if it's a quota exceeded error or connection issue
      const errorMessage = error.message || 'An error occurred';
      
      if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        setApiUnavailable(true);
        toast({
          title: "Service Unavailable",
          description: "Our AI service is currently unavailable due to rate limits. Please try again later.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('Network issue') || errorMessage.includes('Failed to fetch')) {
        toast({
          title: "Connection Error",
          description: "Could not connect to the AI service. Please check your connection and try again.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('timeout')) {
        toast({
          title: "Request Timeout",
          description: "The AI service took too long to respond. Please try again later.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage || 'Failed to get a response. Please try again.',
          variant: "destructive"
        });
      }
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')
            ? 'Sorry, our AI service is currently unavailable due to rate limits. Please try again later.'
            : errorMessage.includes('Network issue') || errorMessage.includes('Failed to fetch')
            ? 'Sorry, I couldn\'t connect to the AI service. Please check your connection and try again.'
            : 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Chat interface */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] shadow-xl flex flex-col z-50">
          <ChatHeader onClose={() => setIsOpen(false)} apiUnavailable={apiUnavailable} />
          
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <ChatMessage 
                    message={{ 
                      role: 'assistant', 
                      content: '', 
                      timestamp: new Date() 
                    }} 
                    isLoading={true} 
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isLoading={isLoading}
              isDisabled={!user || apiUnavailable}
              autoFocus={isOpen}
            />
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
