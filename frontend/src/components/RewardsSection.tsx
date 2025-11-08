import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const achievements = [
  { name: "7-Day Streak", icon: Zap, earned: true, color: "text-accent" },
  { name: "Early Bird", icon: Star, earned: true, color: "text-primary" },
  { name: "100km Runner", icon: Target, earned: false, color: "text-muted-foreground" },
  { name: "Mindful Master", icon: Award, earned: true, color: "text-secondary" },
];

const RewardsSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Achievements & Rewards</h2>
        <Badge variant="secondary" className="rounded-full">
          <Trophy className="w-3 h-3 mr-1" />
          Level 12
        </Badge>
      </div>

      <Card className="glass-card p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress to Level 13</span>
            <span className="text-sm font-semibold">1,840 / 2,000 XP</span>
          </div>
          <Progress value={92} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-4 rounded-lg border ${
                  achievement.earned
                    ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20"
                    : "bg-background/50 border-border/50 opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${
                    achievement.earned
                      ? "bg-gradient-to-br from-primary to-secondary"
                      : "bg-muted"
                  } flex items-center justify-center mb-2`}
                >
                  <Icon className={`w-6 h-6 ${achievement.earned ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <p className="text-xs text-center font-medium">{achievement.name}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-3">Recent Milestones</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Completed 7-day meditation streak!</p>
              <p className="text-xs text-muted-foreground">Earned 50 XP • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Reached 10,000 steps goal!</p>
              <p className="text-xs text-muted-foreground">Earned 30 XP • Yesterday</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RewardsSection;
