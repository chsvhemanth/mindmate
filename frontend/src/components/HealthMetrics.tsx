import { Card } from "@/components/ui/card";
import { Heart, Activity, Droplets, Moon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const heartRateData = [
  { time: "6am", bpm: 68 },
  { time: "9am", bpm: 72 },
  { time: "12pm", bpm: 78 },
  { time: "3pm", bpm: 75 },
  { time: "6pm", bpm: 82 },
  { time: "9pm", bpm: 70 },
];

const HealthMetrics = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Health Vitals</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Heart Rate</span>
            <Heart className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <p className="text-3xl font-bold">72 <span className="text-lg text-muted-foreground">bpm</span></p>
          <p className="text-xs text-muted-foreground mt-1">Normal range</p>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">SpO2</span>
            <Droplets className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">98 <span className="text-lg text-muted-foreground">%</span></p>
          <p className="text-xs text-muted-foreground mt-1">Excellent</p>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Steps Today</span>
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold">8,247</p>
          <p className="text-xs text-muted-foreground mt-1">Goal: 10,000</p>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Sleep</span>
            <Moon className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">7.5 <span className="text-lg text-muted-foreground">hrs</span></p>
          <p className="text-xs text-muted-foreground mt-1">Last night</p>
        </Card>
      </div>

      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Heart Rate Today</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={heartRateData}>
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
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
              dataKey="bpm"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default HealthMetrics;
