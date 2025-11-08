import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { eventAPI } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated?: () => void;
}

const CreateEventDialog = ({
  open,
  onOpenChange,
  onEventCreated,
}: CreateEventDialogProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    date: "",
    time: "",
    maxAttendees: 20,
    category: "meditation" as "meditation" | "support" | "workshop" | "social",
    requiresApproval: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Please sign in to host an event");
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter an event description");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Please enter a location");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter a city");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }
    if (!formData.time) {
      toast.error("Please enter a time");
      return;
    }
    if (formData.maxAttendees < 1) {
      toast.error("Maximum attendees must be at least 1");
      return;
    }

    // Check if date is in the future
    const eventDate = new Date(`${formData.date}T${formData.time}`);
    if (eventDate < new Date()) {
      toast.error("Event date must be in the future");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await eventAPI.createEvent({
        ...formData,
        hostId: user._id,
      });

      if (response.success) {
        toast.success("Event created successfully! 🎉");
        // Reset form
        setFormData({
          title: "",
          description: "",
          location: "",
          city: "",
          date: "",
          time: "",
          maxAttendees: 20,
          category: "meditation",
          requiresApproval: false,
        });
        onOpenChange(false);
        if (onEventCreated) {
          onEventCreated();
        }
      } else {
        toast.error(response.message || "Failed to create event");
      }
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxAttendees" ? parseInt(value) || 0 : value,
    }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Host Your Own Event
          </DialogTitle>
          <DialogDescription>
            Create a community event to connect with others on their wellness
            journey
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Morning Meditation Session"
              value={formData.title}
              onChange={handleChange}
              required
              className="rounded-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your event, what participants can expect, and what they should bring..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Central Park"
                value={formData.location}
                onChange={handleChange}
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                <MapPin className="w-4 h-4 inline mr-1" />
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="e.g., New York"
                value={formData.city}
                onChange={handleChange}
                required
                className="rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">
                <Clock className="w-4 h-4 inline mr-1" />
                Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="support">Support Group</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttendees">
                <Users className="w-4 h-4 inline mr-1" />
                Max Attendees <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                min="1"
                value={formData.maxAttendees}
                onChange={handleChange}
                required
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requiresApproval"
              checked={formData.requiresApproval}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requiresApproval: e.target.checked,
                }))
              }
              className="rounded"
            />
            <Label htmlFor="requiresApproval" className="text-sm">
              Require approval for participants to join
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;

