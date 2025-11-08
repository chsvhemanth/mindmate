import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface TherapistAvatarProps {
  isSpeaking: boolean;
  message?: string;
}

const TherapistAvatar = ({ isSpeaking, message }: TherapistAvatarProps) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);

  // Animate mouth when speaking
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 200); // Mouth movement speed
      return () => clearInterval(interval);
    } else {
      setMouthOpen(false);
    }
  }, [isSpeaking]);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Avatar Container */}
      <div
        className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center transition-all duration-300 ${
          isSpeaking ? "scale-110 shadow-2xl shadow-purple-500/50" : "scale-100"
        }`}
      >
        {/* Face Circle */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center overflow-hidden">
          {/* Hair */}
          <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-amber-800 to-amber-700 rounded-t-full"></div>
          
          {/* Eyes Container */}
          <div className="flex gap-6 mt-8 relative z-10">
            {/* Left Eye */}
            <div className="relative">
              <div className={`w-6 h-6 rounded-full bg-blue-600 transition-all duration-150 ${
                eyeBlink ? "h-1" : ""
              }`}>
                {!eyeBlink && (
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
            
            {/* Right Eye */}
            <div className="relative">
              <div className={`w-6 h-6 rounded-full bg-blue-600 transition-all duration-150 ${
                eyeBlink ? "h-1" : ""
              }`}>
                {!eyeBlink && (
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>

          {/* Nose */}
          <div className="w-2 h-3 bg-amber-300 rounded-full mt-2 relative z-10"></div>

          {/* Mouth */}
          <div className="mt-3 relative z-10">
            {isSpeaking && mouthOpen ? (
              <div className="w-8 h-6 bg-rose-400 rounded-full animate-pulse"></div>
            ) : (
              <div className="w-8 h-2 bg-rose-400 rounded-full"></div>
            )}
          </div>

          {/* Speaking Animation Rings */}
          {isSpeaking && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border-4 border-pink-400 animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>

        {/* Professional Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg border-2 border-purple-300">
          <span className="text-xs font-semibold text-purple-600">Therapist</span>
        </div>
      </div>

      {/* Name Tag */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <span className="text-sm font-medium text-gray-700">Dr. MindMate</span>
      </div>
    </div>
  );
};

export default TherapistAvatar;

