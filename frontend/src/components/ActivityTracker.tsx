import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bike, Footprints, Dumbbell, Flame, Plus } from "lucide-react";

const activities = [
  { name: "Morning Run", type: "Running", distance: "5.2 km", calories: 320, time: "32 min", icon: Footprints },
  { name: "Cycling", type: "Cycling", distance: "12.8 km", calories: 450, time: "45 min", icon: Bike },
  { name: "Gym Session", type: "Strength", distance: "-", calories: 280, time: "60 min", icon: Dumbbell },
];

const ActivityTracker = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Activity Tracker</h2>
        <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-secondary">
          <Plus className="w-4 h-4 mr-1" />
          Log Activity
        </Button>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Daily Calorie Goal</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={75} className="flex-1" />
              <span className="text-sm font-semibold">1,050 / 1,400</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-bold text-primary">25.8</p>
            <p className="text-xs text-muted-foreground">km this week</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-bold text-secondary">4</p>
            <p className="text-xs text-muted-foreground">workouts</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-bold text-accent">137</p>
            <p className="text-xs text-muted-foreground">minutes active</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <Card key={index} className="glass-card p-4 hover:scale-[1.02] smooth-transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{activity.name}</h3>
                  <p className="text-sm text-muted-foreground">{activity.type}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{activity.distance}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">{activity.calories}</p>
                  <p className="text-xs text-muted-foreground">cal</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTracker;
