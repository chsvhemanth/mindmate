import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Sparkles,
  Search,
  Heart,
  Coffee,
  BookOpen,
  Sunrise,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { eventAPI } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import mindmateLogo from "@/assets/mindmate-logo.png";
import CreateEventDialog from "@/components/CreateEventDialog";

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  category: "meditation" | "support" | "workshop" | "social";
  requiresApproval?: boolean;
  userStatus?: "pending" | "approved" | "rejected" | null;
  icon?: any;
}

const categoryIcons: Record<Event["category"], any> = {
  meditation: Sunrise,
  support: Heart,
  workshop: BookOpen,
  social: Coffee,
};

const categoryColors: Record<Event["category"], string> = {
  meditation: "bg-primary/20 text-primary border-primary/30",
  support: "bg-secondary/20 text-secondary border-secondary/30",
  workshop: "bg-accent/20 text-accent border-accent/30",
  social: "bg-orange-100 text-orange-700 border-orange-200",
};

const Community = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState<string[]>(["all"]);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [selectedCity]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await eventAPI.getAllEvents({
        city: selectedCity === "all" ? undefined : selectedCity,
        limit: 100,
      });

      if (response.success && response.data) {
        const eventsData = response.data.map((event: any) => ({
          ...event,
          icon: categoryIcons[event.category] || Sparkles,
        }));
        setEvents(eventsData);

        // Extract unique cities
        const uniqueCities = Array.from(
          new Set(eventsData.map((e: Event) => e.city))
        );
        setCities(["all", ...uniqueCities]);
      }
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleJoinEvent = async (eventId: string, eventTitle: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to join events");
      return;
    }

    try {
      const response = await eventAPI.joinEvent(eventId, user._id);

      if (response.success) {
        toast.success(
          response.message ||
            `You've joined "${eventTitle}"! See you there! 🎉`
        );
        // Refresh events to update status
        fetchEvents();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={mindmateLogo} alt="MindMate" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">Community Events</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Connect with others on their wellness journey
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/chat")}
                className="rounded-full text-sm"
              >
                Chat
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="rounded-full text-sm"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-2"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full sm:w-48 rounded-full border-2">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city === "all" ? "All Locations" : city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Legend */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={categoryColors.meditation}>
              Meditation
            </Badge>
            <Badge variant="outline" className={categoryColors.support}>
              Support Groups
            </Badge>
            <Badge variant="outline" className={categoryColors.workshop}>
              Workshops
            </Badge>
            <Badge variant="outline" className={categoryColors.social}>
              Social
            </Badge>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <Card className="glass-card p-12 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
            </div>
            <p className="text-muted-foreground mt-4">Loading events...</p>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back soon for new events!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const Icon = event.icon || Sparkles;
              const isJoined =
                event.userStatus === "approved" || event.userStatus === "pending";
              const isPending = event.userStatus === "pending";
              const spotsLeft = event.maxAttendees - event.attendees;

              return (
                <Card
                  key={event._id}
                  className="glass-card overflow-hidden hover:scale-105 smooth-transition animate-slide-up"
                >
                  {/* Event Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className={categoryColors[event.category]}>
                        {event.category}
                      </Badge>
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {event.location}, {event.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {event.attendees}/{event.maxAttendees} attendees
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Footer */}
                  <div className="px-6 pb-6 pt-2">
                    {spotsLeft <= 3 && spotsLeft > 0 && (
                      <p className="text-xs text-orange-600 mb-3">
                        Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left!
                      </p>
                    )}
                    <Button
                      onClick={() => handleJoinEvent(event._id, event.title)}
                      disabled={isJoined || spotsLeft === 0}
                      className="w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50"
                    >
                      {isPending
                        ? "⏳ Pending Approval"
                        : isJoined
                        ? "✓ Joined"
                        : spotsLeft === 0
                        ? "Event Full"
                        : "Join Event"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Banner */}
        <Card className="glass-card p-6 sm:p-8 mt-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Want to host your own event?
              </h3>
              <p className="text-sm sm:text-base text-foreground/80 mb-4">
                MindMate community events are a great way to connect, learn, and grow together.
                Contact us to organize an event in your area!
              </p>
              <Button
                variant="outline"
                className="rounded-full border-2"
                onClick={() => {
                  if (!isAuthenticated || !user) {
                    toast.error("Please sign in to host an event");
                    return;
                  }
                  setShowCreateEventDialog(true);
                }}
              >
                Host an Event
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <CreateEventDialog
        open={showCreateEventDialog}
        onOpenChange={setShowCreateEventDialog}
        onEventCreated={fetchEvents}
      />
    </div>
  );
};

export default Community;
