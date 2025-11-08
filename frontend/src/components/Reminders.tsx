import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Droplet, Brain, Moon, Plus } from "lucide-react";
import { useState } from "react";

const defaultReminders = [
  { id: 1, title: "Drink Water", icon: Droplet, time: "Every 2 hours", enabled: true, color: "text-accent" },
  { id: 2, title: "Meditation Break", icon: Brain, time: "10:00 AM & 6:00 PM", enabled: true, color: "text-primary" },
  { id: 3, title: "Evening Walk", icon: Bell, time: "5:30 PM", enabled: false, color: "text-secondary" },
  { id: 4, title: "Sleep Time", icon: Moon, time: "10:30 PM", enabled: true, color: "text-primary" },
];

const Reminders = () => {
  const [reminders, setReminders] = useState(defaultReminders);

  const toggleReminder = (id: number) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daily Reminders</h2>
        <Button size="sm" variant="outline" className="rounded-full">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder) => {
          const Icon = reminder.icon;
          return (
            <Card key={reminder.id} className="glass-card p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${reminder.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{reminder.title}</h3>
                  <p className="text-sm text-muted-foreground">{reminder.time}</p>
                </div>
                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card p-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="text-sm font-semibold">Enable notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get timely reminders to stay on track with your wellness goals
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reminders;
