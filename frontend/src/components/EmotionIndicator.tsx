import { Card } from "@/components/ui/card";
import { Smile, Frown, Angry, Meh, Zap } from "lucide-react";

interface EmotionIndicatorProps {
  emotion: string;
}

const emotionConfig: Record<
  string,
  { icon: any; label: string; gradient: string }
> = {
  happy: {
    icon: Smile,
    label: "Happy",
    gradient: "from-accent via-accent-glow to-accent",
  },
  sad: {
    icon: Frown,
    label: "Sad",
    gradient: "from-primary via-primary-glow to-primary",
  },
  angry: {
    icon: Angry,
    label: "Angry",
    gradient: "from-destructive via-destructive to-destructive/80",
  },
  calm: {
    icon: Meh,
    label: "Calm",
    gradient: "from-secondary via-secondary-glow to-secondary",
  },
  anxious: {
    icon: Zap,
    label: "Anxious",
    gradient: "from-accent via-secondary to-primary",
  },
};

const EmotionIndicator = ({ emotion }: EmotionIndicatorProps) => {
  const config = emotionConfig[emotion] || emotionConfig.calm;
  const Icon = config.icon;

  return (
    <Card className={`bg-gradient-to-r ${config.gradient} border-none px-5 py-3 flex items-center gap-3 shadow-lg hover-lift touch-feedback`}>
      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-semibold text-white">{config.label}</span>
    </Card>
  );
};

export default EmotionIndicator;
