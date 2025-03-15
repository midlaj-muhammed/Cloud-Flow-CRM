"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Bot,
  Send,
  Loader2,
  Maximize2,
  Minimize2,
  X,
  MessageSquare,
  Mic,
  MicOff,
  Download,
  Command,
  Calendar,
  Users,
  LineChart,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  Check,
  AlertTriangle,
  UserPlus,
  Search,
  Activity,
  BarChart,
  BarChart2,
  BarChart3,
  CalendarDays,
  CalendarRange,
  CalendarPlus,
  PenSquare,
  Notebook,
  FileText,
  FileSearch,
  Settings,
  Palette,
  Languages,
  Bell,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  command?: string;
}

interface ChatBotProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
}

const CHAT_COMMANDS = {
  // Task Management
  "/tasks": "Show my pending tasks",
  "/task-add": "Add a new task",
  "/task-complete": "Mark a task as complete",
  "/task-priority": "Show high priority tasks",
  "/task-overdue": "Show overdue tasks",
  
  // Customer Management
  "/customers": "Show recent customers",
  "/customer-add": "Add a new customer",
  "/customer-search": "Search for a customer",
  "/customer-segment": "Show customer segments",
  "/customer-activity": "Show recent customer activities",
  
  // Analytics & Reports
  "/analytics": "Show analytics summary",
  "/report-daily": "Generate daily report",
  "/report-weekly": "Generate weekly report",
  "/report-monthly": "Generate monthly report",
  "/report-export": "Export current report",
  
  // Schedule & Calendar
  "/schedule": "Show today's schedule",
  "/schedule-week": "Show this week's schedule",
  "/schedule-month": "Show this month's schedule",
  "/schedule-add": "Add a new schedule item",
  
  // Notes & Documentation
  "/note-add": "Add a new note",
  "/notes": "Show recent notes",
  "/docs": "Show documentation",
  "/docs-search": "Search documentation",
  
  // System & Settings
  "/settings": "Show bot settings",
  "/theme": "Change theme",
  "/language": "Change language",
  "/notifications": "Manage notifications",
  "/help": "Show available commands",
} as const;

const COMMAND_ICONS: Record<string, React.ReactNode> = {
  "/tasks": <CheckCircle2 className="h-4 w-4" />,
  "/task-add": <Plus className="h-4 w-4" />,
  "/task-complete": <Check className="h-4 w-4" />,
  "/task-priority": <AlertTriangle className="h-4 w-4" />,
  "/task-overdue": <Clock className="h-4 w-4" />,
  
  "/customers": <Users className="h-4 w-4" />,
  "/customer-add": <UserPlus className="h-4 w-4" />,
  "/customer-search": <Search className="h-4 w-4" />,
  "/customer-segment": <Users className="h-4 w-4" />,
  "/customer-activity": <Activity className="h-4 w-4" />,
  
  "/analytics": <LineChart className="h-4 w-4" />,
  "/report-daily": <BarChart className="h-4 w-4" />,
  "/report-weekly": <BarChart2 className="h-4 w-4" />,
  "/report-monthly": <BarChart3 className="h-4 w-4" />,
  "/report-export": <Download className="h-4 w-4" />,
  
  "/schedule": <Calendar className="h-4 w-4" />,
  "/schedule-week": <CalendarDays className="h-4 w-4" />,
  "/schedule-month": <CalendarRange className="h-4 w-4" />,
  "/schedule-add": <CalendarPlus className="h-4 w-4" />,
  
  "/note-add": <PenSquare className="h-4 w-4" />,
  "/notes": <Notebook className="h-4 w-4" />,
  "/docs": <FileText className="h-4 w-4" />,
  "/docs-search": <FileSearch className="h-4 w-4" />,
  
  "/settings": <Settings className="h-4 w-4" />,
  "/theme": <Palette className="h-4 w-4" />,
  "/language": <Languages className="h-4 w-4" />,
  "/notifications": <Bell className="h-4 w-4" />,
  "/help": <HelpCircle className="h-4 w-4" />,
} as const;

const COMMAND_CATEGORIES = {
  "Task Management": ["/tasks", "/task-add", "/task-complete", "/task-priority", "/task-overdue"],
  "Customer Management": ["/customers", "/customer-add", "/customer-search", "/customer-segment", "/customer-activity"],
  "Analytics & Reports": ["/analytics", "/report-daily", "/report-weekly", "/report-monthly", "/report-export"],
  "Schedule & Calendar": ["/schedule", "/schedule-week", "/schedule-month", "/schedule-add"],
  "Notes & Documentation": ["/note-add", "/notes", "/docs", "/docs-search"],
  "System & Settings": ["/settings", "/theme", "/language", "/notifications", "/help"],
} as const;

function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Cloud Flow CRM Commands
          </DialogTitle>
          <DialogDescription>
            Quick access to all available commands and features
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {Object.entries(COMMAND_CATEGORIES).map(([category, commands]) => (
            <Card key={category} className="p-4 shadow-sm border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-gray-50">
                  {category === "Task Management" && <CheckCircle2 className="h-5 w-5" />}
                  {category === "Customer Management" && <Users className="h-5 w-5" />}
                  {category === "Analytics & Reports" && <LineChart className="h-5 w-5" />}
                  {category === "Schedule & Calendar" && <Calendar className="h-5 w-5" />}
                  {category === "Notes & Documentation" && <FileText className="h-5 w-5" />}
                  {category === "System & Settings" && <Settings className="h-5 w-5" />}
                </div>
                <h3 className="font-semibold text-sm">{category}</h3>
              </div>
              <div className="space-y-2">
                {commands.map((command) => (
                  <div key={command} className="flex items-start gap-2 text-sm">
                    <div className="flex items-center justify-center w-6 h-6">
                      {COMMAND_ICONS[command]}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{command}</div>
                      <div className="text-xs text-gray-500">
                        {CHAT_COMMANDS[command as keyof typeof CHAT_COMMANDS]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border shadow-sm">/</kbd>
              <span className="text-gray-600">Open command menu</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border shadow-sm">↑</kbd>
              <span className="text-gray-600">Previous message</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border shadow-sm">Esc</kbd>
              <span className="text-gray-600">Close dialogs</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white rounded border shadow-sm">Enter</kbd>
              <span className="text-gray-600">Send message</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ChatBot({ initialMessages = [], onSendMessage }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesisRef.current = new SpeechSynthesisUtterance();
      speechSynthesisRef.current.rate = 1;
      speechSynthesisRef.current.pitch = 1;
      speechSynthesisRef.current.volume = 1;
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        setIsLoading(true);
        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (data.text) {
            setInput(data.text);
            handleSendMessage(data.text);
          }
        } catch (error) {
          console.error("Transcription failed:", error);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
    }
  };

  const speakMessage = (text: string) => {
    if (isSpeaking && speechSynthesisRef.current) {
      speechSynthesisRef.current.text = text;
      window.speechSynthesis.speak(speechSynthesisRef.current);
    }
  };

  const handleCommand = (command: keyof typeof CHAT_COMMANDS) => {
    if (command === "/help") {
      setShowHelp(true);
      setShowCommands(false);
    } else {
      setInput(command);
      setShowCommands(false);
    }
  };

  const exportChatHistory = () => {
    const history = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      command: msg.command,
    }));

    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const isCommand = messageText.startsWith("/");
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
      command: isCommand ? messageText : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            command: msg.command,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (isSpeaking) {
        speakMessage(data.message);
      }
      onSendMessage?.(messageText);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "/" && input === "") {
      e.preventDefault();
      setShowCommands(true);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-black text-white hover:bg-black/90 transition-all shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 w-[380px] shadow-lg transition-all duration-200",
        isExpanded && "w-[600px] h-[80vh]"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/bot-avatar.png" />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
            <CardDescription className="text-xs">
              {isLoading ? "Typing..." : "Online"}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chat History</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col space-y-1 p-2 rounded-lg",
                      msg.role === "user" ? "bg-gray-100" : "bg-white border"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {msg.role === "user" ? "You" : "AI"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                    {msg.command && (
                      <Badge variant="secondary" className="w-fit">
                        {msg.command}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={toggleSpeech}
          >
            {isSpeaking ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={exportChatHistory}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <HelpDialog open={showHelp} onOpenChange={setShowHelp} />
        <ScrollArea
          ref={scrollAreaRef}
          className={cn(
            "h-[400px] px-4",
            isExpanded && "h-[calc(80vh-140px)]"
          )}
        >
          <div className="flex flex-col space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "bg-gray-100"
                )}
              >
                <div className="flex items-center gap-2">
                  {message.role === "assistant" && (
                    <Badge variant="outline" className="h-5 bg-white">
                      AI
                    </Badge>
                  )}
                  {message.content}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.command && (
                    <Badge
                      variant="secondary"
                      className="h-5 bg-black/10 text-[10px]"
                    >
                      {message.command}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4">
        <div className="flex w-full items-center space-x-2">
          <DropdownMenu open={showCommands} onOpenChange={setShowCommands}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-gray-100"
              >
                <Command className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[300px] max-h-[400px] overflow-y-auto p-2"
            >
              {Object.entries(COMMAND_CATEGORIES).map(([category, commands]) => (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                    {category}
                  </div>
                  {commands.map((command) => (
                    <DropdownMenuItem
                      key={command}
                      onClick={() => handleCommand(command as keyof typeof CHAT_COMMANDS)}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-center w-6 h-6">
                        {COMMAND_ICONS[command]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{command}</span>
                        <span className="text-xs text-gray-500">
                          {CHAT_COMMANDS[command as keyof typeof CHAT_COMMANDS]}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 hover:bg-gray-100",
              isRecording && "bg-red-50 text-red-500 hover:bg-red-50"
            )}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="h-9 bg-black text-white hover:bg-black/90 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
