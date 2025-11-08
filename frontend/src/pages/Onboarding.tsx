import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import mindmateLogo from "@/assets/mindmate-logo.png";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation: "",
    sleepHours: "",
    stressLevel: "",
    exerciseFrequency: "",
    mentalHealthGoals: [] as string[],
    preferredActivities: [] as string[],
    medicalConditions: "",
    emergencyContact: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    localStorage.setItem("kymData", JSON.stringify(formData));
    localStorage.setItem("kymCompleted", "true");
    toast.success("Profile created successfully!");
    navigate("/dashboard");
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      mentalHealthGoals: prev.mentalHealthGoals.includes(goal)
        ? prev.mentalHealthGoals.filter(g => g !== goal)
        : [...prev.mentalHealthGoals, goal]
    }));
  };

  const toggleActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter(a => a !== activity)
        : [...prev.preferredActivities, activity]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <img src={mindmateLogo} alt="MindMate" className="w-16 h-16" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-2">
          Know You More (KYM)
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Help us personalize your wellness journey
        </p>

        <Progress value={progress} className="mb-8" />

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Your age"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Student/Professional"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Lifestyle */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label>Average Sleep Hours per Night</Label>
              <RadioGroup
                value={formData.sleepHours}
                onValueChange={(value) => setFormData({ ...formData, sleepHours: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less-than-5" id="sleep1" />
                  <Label htmlFor="sleep1">Less than 5 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5-7" id="sleep2" />
                  <Label htmlFor="sleep2">5-7 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7-9" id="sleep3" />
                  <Label htmlFor="sleep3">7-9 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="more-than-9" id="sleep4" />
                  <Label htmlFor="sleep4">More than 9 hours</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Current Stress Level</Label>
              <RadioGroup
                value={formData.stressLevel}
                onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="stress1" />
                  <Label htmlFor="stress1">Low - I feel calm most days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="stress2" />
                  <Label htmlFor="stress2">Moderate - Some stress but manageable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="stress3" />
                  <Label htmlFor="stress3">High - Often overwhelmed</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Exercise Frequency</Label>
              <RadioGroup
                value={formData.exerciseFrequency}
                onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="ex1" />
                  <Label htmlFor="ex1">Rarely or never</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2" id="ex2" />
                  <Label htmlFor="ex2">1-2 times per week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-5" id="ex3" />
                  <Label htmlFor="ex3">3-5 times per week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="ex4" />
                  <Label htmlFor="ex4">Daily</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 3: Goals & Activities */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label>Mental Health Goals (Select all that apply)</Label>
              <div className="mt-3 space-y-2">
                {["Reduce anxiety", "Better sleep", "Manage stress", "Build confidence", "Improve mood", "Develop mindfulness"].map(goal => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.mentalHealthGoals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                    />
                    <Label htmlFor={goal} className="font-normal">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Preferred Activities (Select all that apply)</Label>
              <div className="mt-3 space-y-2">
                {["Meditation", "Yoga", "Walking", "Running", "Cycling", "Swimming", "Gym workouts", "Dancing"].map(activity => (
                  <div key={activity} className="flex items-center space-x-2">
                    <Checkbox
                      id={activity}
                      checked={formData.preferredActivities.includes(activity)}
                      onCheckedChange={() => toggleActivity(activity)}
                    />
                    <Label htmlFor={activity} className="font-normal">{activity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Health & Emergency */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="medical">Medical Conditions (Optional)</Label>
              <Textarea
                id="medical"
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                placeholder="Any medical conditions or medications we should know about"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="Phone number of someone you trust"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={step === 1}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          {step < totalSteps ? (
            <Button onClick={handleNext} className="rounded-full bg-gradient-to-r from-primary to-secondary">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="rounded-full bg-gradient-to-r from-primary to-secondary">
              Complete
              <Check className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
