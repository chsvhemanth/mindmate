import { useState, useEffect, useRef } from "react";
import { Send, Mic, Video, Home, Users, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ChatMessage from "@/components/ChatMessage";
import EmotionIndicator from "@/components/EmotionIndicator";
import NearbyTherapists from "@/components/NearbyTherapists";
import { analyzeEmotion } from "@/utils/emotionAnalysis";
import { getAIResponse } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import mindmateLogo from "@/assets/mindmate-logo.png";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  emotion?: string;
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello, I'm here to listen. How are you feeling today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>("calm");
  const [showTherapists, setShowTherapists] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Get user location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to continue chatting");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Analyze emotion
      const emotion = await analyzeEmotion(userInput);
      setCurrentEmotion(emotion);

      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      // Get AI response from backend using Groq
      const response = await getAIResponse(userInput, conversationHistory, emotion);

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          role: "assistant",
          emotion: response.data.emotion || emotion,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "I'm having trouble connecting. Please try again.");
      
      // Fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src={mindmateLogo} 
                alt="MindMate" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">MindMate</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Your AI companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EmotionIndicator emotion={currentEmotion} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/video-chat")}
                className="rounded-full bg-gradient-to-br from-primary to-secondary text-white hover:opacity-90"
                title="Start Video Session"
              >
                <Video className="w-5 h-5" />
              </Button>
              <div className="hidden sm:flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="rounded-full"
                >
                  <Home className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/community")}
                  className="rounded-full"
                >
                  <Users className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full"
                >
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="glass-card px-6 py-4 max-w-[80%]">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-md p-3 sm:p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="pr-10 sm:pr-12 py-4 sm:py-6 text-sm sm:text-base rounded-3xl border-2 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 sm:h-10 sm:w-10"
                onClick={() => toast.info("Voice input coming soon!")}
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-primary to-secondary hover:opacity-90 smooth-transition flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTherapists(true)}
              className="rounded-full text-xs sm:text-sm"
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Book In-Home Therapy Session
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Your conversations are private and secure
          </p>
        </div>
      </div>

      <NearbyTherapists
        open={showTherapists}
        onOpenChange={setShowTherapists}
        userLocation={userLocation}
      />
    </div>
  );
};

export default Chat;
