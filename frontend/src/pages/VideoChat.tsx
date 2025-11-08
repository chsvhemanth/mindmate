import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, ArrowLeft, Volume2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { analyzeEmotion } from "@/utils/emotionAnalysis";
import { getAIResponse } from "@/utils/api";
import TherapistAvatar from "@/components/TherapistAvatar";
import NearbyTherapists from "@/components/NearbyTherapists";
import { useAuth } from "@/contexts/AuthContext";

const VideoChat = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [therapistMessage, setTherapistMessage] = useState(
    "Hello, I'm here to listen. Take your time and share what's on your mind."
  );
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [showTherapists, setShowTherapists] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  const recognitionRef = useRef<any>(null);
  const lastProcessedTextRef = useRef<string>("");
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isListeningRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);

  // Initialize speech recognition
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (!recognitionRef.current && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = async (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript + " ";
          else interimTranscript += transcript;
        }

        if (interimTranscript) setTranscript(interimTranscript);

        if (finalTranscript.trim()) {
          const cleanedText = finalTranscript.trim();
          if (cleanedText.toLowerCase() === lastProcessedTextRef.current.toLowerCase()) return;

          if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);

          processingTimeoutRef.current = setTimeout(async () => {
            if (isProcessingRef.current) return;

            setTranscript(cleanedText);
            lastProcessedTextRef.current = cleanedText;
            await handleUserSpeech(cleanedText);
          }, 1000);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied.");
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognitionRef.current.onend = () => {
        // Auto-restart only if not speaking and not processing
        if (isListeningRef.current && !isSpeaking && !isProcessingRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error("Error restarting recognition:", error);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
      if (speechSynthesisRef.current && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [isAuthenticated, navigate]);

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

  const handleUserSpeech = async (text: string) => {
    if (isProcessingRef.current) return;

    try {
      isProcessingRef.current = true;
      setIsProcessing(true);

      // Stop listening while processing
      if (recognitionRef.current && isListeningRef.current) recognitionRef.current.stop();

      const emotion = await analyzeEmotion(text);

      const updatedHistory = [...conversationHistory, { role: "user", content: text }].slice(-10);

      const response = await getAIResponse(text, updatedHistory, emotion);

      if (response.success && response.data) {
        const aiResponse = response.data.response;
        setTherapistMessage(aiResponse);
        setConversationHistory([...updatedHistory, { role: "assistant", content: aiResponse }].slice(-10));

        // Speak the AI response
        speakResponse(aiResponse);
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (error: any) {
      console.error("Error processing speech:", error);
      toast.error(error.message || "Failed to process speech.");
      setTherapistMessage("I'm sorry, could you please repeat that?");
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    // Stop recognition while AI is speaking
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      speechSynthesisRef.current = utterance;
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      speechSynthesisRef.current = null;

      // Restart recognition after AI finishes speaking
      if (isListeningRef.current && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error("Error restarting recognition:", error);
          }
        }, 500);
      }
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
      if (isListeningRef.current && recognitionRef.current) recognitionRef.current.start();
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported.");
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      window.speechSynthesis.cancel();
      setIsListening(false);
      setTranscript("");
      toast.info("Microphone off");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());

        isListeningRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript("");
        lastProcessedTextRef.current = "";
        toast.success("Listening...");
      } catch (error: any) {
        console.error("Microphone access denied:", error);
        isListeningRef.current = false;
        setIsListening(false);
        toast.error("Could not access microphone. Please allow microphone access.");
      }
    }
  };

  const endSession = () => {
    isListeningRef.current = false;
    if (recognitionRef.current) recognitionRef.current.stop();
    window.speechSynthesis.cancel();
    if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setTranscript("");
    navigate("/chat");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={endSession} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold">Video Session</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl space-y-6">
          <Card className="relative aspect-video w-full overflow-hidden glass-card bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <TherapistAvatar isSpeaking={isSpeaking} message={therapistMessage} />
            </div>

            {isSpeaking && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2">
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-primary rounded-full animate-bounce" />
                  <div className="w-1 h-4 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-4 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-sm text-muted-foreground">Processing...</span>
              </div>
            )}
          </Card>

          <Card className="glass-card px-6 py-4 bg-gradient-to-br from-white/60 to-primary/20">
            <p className="text-foreground text-center leading-relaxed">{therapistMessage}</p>
          </Card>

          {transcript && (
            <Card className="glass-card px-6 py-4 bg-gradient-to-br from-accent/40 to-secondary/30 border-accent/50">
              <p className="text-foreground text-center italic">"{transcript}"</p>
            </Card>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleListening}
              size="lg"
              className={`rounded-full h-16 w-16 sm:h-20 sm:w-20 smooth-transition ${
                isListening ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-to-br from-primary to-secondary hover:opacity-90"
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6 sm:w-8 sm:h-8" /> : <Mic className="w-6 h-6 sm:w-8 sm:h-8" />}
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
            {isListening ? "I'm listening... speak freely" : "Click the microphone to start talking"}
          </p>

          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTherapists(true)}
              className="rounded-full"
            >
              <Heart className="w-4 h-4 mr-2" />
              Book In-Home Therapy Session
            </Button>
          </div>
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

export default VideoChat;
