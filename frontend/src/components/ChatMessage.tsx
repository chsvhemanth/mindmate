import { Card } from "@/components/ui/card";
import { Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  emotion?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😔",
  angry: "😠",
  calm: "😌",
  anxious: "😰",
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex ${isAssistant ? "justify-start" : "justify-end"} fade-in`}
    >
      <div className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${isAssistant ? "flex-row" : "flex-row-reverse"}`}>
        {/* Avatar */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 hover:scale-110 ${
            isAssistant
              ? "bg-gradient-to-br from-primary via-primary-glow to-secondary"
              : "bg-gradient-to-br from-accent via-accent-glow to-secondary"
          }`}
        >
          {isAssistant ? (
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <Card
          className={`px-5 py-4 smooth-transition hover-lift ${
            isAssistant
              ? "glass-card bg-gradient-to-br from-white/70 to-primary/10 border-primary/20"
              : "bg-gradient-to-br from-accent/30 to-secondary/20 border-accent/30"
          }`}
        >
          <p className="text-foreground leading-relaxed text-[15px]">{message.content}</p>
          {message.emotion && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground bg-background/40 rounded-lg px-3 py-1.5 w-fit">
              <span className="text-base">{emotionEmojis[message.emotion] || "😌"}</span>
              <span className="capitalize font-medium">{message.emotion}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
