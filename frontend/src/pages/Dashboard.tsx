import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Heart, Brain, Users, MessageCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import mindmateLogo from "@/assets/mindmate-logo.png";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import HealthMetrics from "@/components/HealthMetrics";
import ActivityTracker from "@/components/ActivityTracker";
import RewardsSection from "@/components/RewardsSection";
import Reminders from "@/components/Reminders";
import EmergencySupport from "@/components/EmergencySupport";
import TherapistFinder from "@/components/TherapistFinder";

const moodData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 60 },
  { day: "Thu", score: 75 },
  { day: "Fri", score: 80 },
  { day: "Sat", score: 85 },
  { day: "Sun", score: 78 },
];

const emotionData = [
  { name: "Calm", value: 35, color: "hsl(280, 30%, 78%)" },
  { name: "Happy", value: 25, color: "hsl(150, 50%, 80%)" },
  { name: "Anxious", value: 20, color: "hsl(30, 70%, 82%)" },
  { name: "Sad", value: 15, color: "hsl(208, 60%, 78%)" },
  { name: "Other", value: 5, color: "hsl(210, 30%, 92%)" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [kymCompleted, setKymCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("kymCompleted");
    setKymCompleted(completed === "true");
  }, []);

  const handleRetakeKYM = () => {
    toast.info("Redirecting to KYM form...");
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src={mindmateLogo} 
                alt="MindMate" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
              <h1 className="text-xl sm:text-2xl font-semibold">Your Wellness Journey</h1>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => navigate("/community")}
                variant="outline"
                className="flex-1 sm:flex-initial rounded-full text-sm"
              >
                <Users className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Community</span>
              </Button>
              <Button
                onClick={() => navigate("/chat")}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-full text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Continue </span>Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* KYM Banner */}
        {!kymCompleted && (
          <Card className="glass-card p-4 sm:p-6 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Help us personalize your wellness journey by completing the Know You More (KYM) form
                </p>
              </div>
              <Button onClick={() => navigate("/onboarding")} className="rounded-full bg-gradient-to-r from-primary to-secondary w-full sm:w-auto">
                Complete KYM
              </Button>
            </div>
          </Card>
        )}

        {kymCompleted && (
          <Card className="glass-card p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Your KYM Profile is Active</h3>
                <p className="text-sm text-muted-foreground mt-1">Last updated: Today</p>
              </div>
              <Button onClick={handleRetakeKYM} variant="outline" className="rounded-full w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake KYM
              </Button>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="glass-card p-6 hover:scale-105 smooth-transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Mood</p>
                <p className="text-2xl font-semibold">73%</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover:scale-105 smooth-transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-semibold">+12%</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover:scale-105 smooth-transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-semibold">24</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Health Metrics */}
        <div className="mb-6 sm:mb-8">
          <HealthMetrics />
        </div>

        {/* Activity Tracker */}
        <div className="mb-6 sm:mb-8">
          <ActivityTracker />
        </div>

        {/* Rewards */}
        <div className="mb-6 sm:mb-8">
          <RewardsSection />
        </div>

        {/* Reminders */}
        <div className="mb-6 sm:mb-8">
          <Reminders />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6">Weekly Mood Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6">Emotion Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="glass-card p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Weekly Insight</h2>
              <p className="text-foreground/80 leading-relaxed">
                You've been showing positive progress this week! Your mood has been more stable,
                with an upward trend toward calmness and contentment. Keep nurturing yourself with
                the practices that bring you peace. Remember, every small step forward is a victory
                worth celebrating.
              </p>
            </div>
          </div>
        </Card>

        {/* Emergency Support */}
        <div className="mb-6 sm:mb-8">
          <EmergencySupport />
        </div>

        {/* Therapist Finder */}
        <div className="mb-6 sm:mb-8">
          <TherapistFinder />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
