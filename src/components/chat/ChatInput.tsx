
import { FormEvent, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (e?: FormEvent) => void;
  isLoading: boolean;
  isDisabled: boolean;
  autoFocus?: boolean;
}

export const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  isLoading, 
  isDisabled,
  autoFocus = false 
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  return (
    <form onSubmit={onSend} className="flex w-full gap-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading || isDisabled}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || isDisabled || !value.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
