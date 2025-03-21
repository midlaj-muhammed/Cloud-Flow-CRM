
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="p-3 border-b flex flex-row items-center justify-between space-y-0">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">CloudGPT Assistant</h2>
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          Free
        </Badge>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
