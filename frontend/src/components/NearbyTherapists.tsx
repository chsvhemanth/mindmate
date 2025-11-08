import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  DollarSign,
  X,
  Navigation,
  Video,
} from "lucide-react";
import { therapistAPI } from "@/utils/api";
import { toast } from "sonner";

interface Therapist {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  location: {
    address: string;
    city: string;
    state?: string;
    zipCode?: string;
  };
  rate: number;
  bio?: string;
  qualifications?: string[];
  languages?: string[];
  rating: number;
  reviewCount: number;
  distance?: number;
}

interface NearbyTherapistsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLocation?: { latitude: number; longitude: number };
}

const NearbyTherapists = ({
  open,
  onOpenChange,
  userLocation,
}: NearbyTherapistsProps) => {
  const [allTherapists, setAllTherapists] = useState<Therapist[]>([]);
  const [displayedCount, setDisplayedCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isVirtualOnly, setIsVirtualOnly] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    null
  );

  // Get therapists to display (first N therapists)
  const displayedTherapists = allTherapists.slice(0, displayedCount);
  const hasMore = allTherapists.length > displayedCount;

  useEffect(() => {
    if (open) {
      fetchTherapists();
      setDisplayedCount(5); // Reset to 5 when dialog opens
      setIsVirtualOnly(false); // Reset virtual flag
    }
  }, [open, userLocation]);

  const fetchTherapists = async () => {
    setIsLoading(true);
    setIsVirtualOnly(false); // Reset first
    
    try {
      let nearbyResponse;
      let nearbyTherapistsCount = 0;
      
      // Try to find nearby therapists first
      try {
        if (userLocation) {
          nearbyResponse = await therapistAPI.findNearbyTherapists({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            maxDistance: 20,
            limit: 50,
          });
        } else {
          const position = await getCurrentPosition();
          nearbyResponse = await therapistAPI.findNearbyTherapists({
            latitude: position.latitude,
            longitude: position.longitude,
            maxDistance: 20,
            limit: 50,
          });
        }

        // Check if we got nearby therapists
        if (nearbyResponse && nearbyResponse.success && nearbyResponse.data) {
          const therapists = Array.isArray(nearbyResponse.data) ? nearbyResponse.data : [];
          nearbyTherapistsCount = therapists.length;
          
          if (nearbyTherapistsCount > 0) {
            // Found nearby therapists - use them
            console.log(`Found ${nearbyTherapistsCount} nearby therapists`);
            setAllTherapists(therapists);
            setIsVirtualOnly(false);
            setIsLoading(false);
            return; // Exit early if we found nearby therapists
          }
        }
      } catch (nearbyError: any) {
        console.log("Error finding nearby therapists:", nearbyError);
        // Continue to virtual therapists
      }

      // If we reach here, no nearby therapists were found - show virtual options
      console.log("No nearby therapists found. Fetching virtual therapy options...");
      
      const virtualResponse = await therapistAPI.getAllTherapists({ limit: 10 });
      console.log("Virtual therapists response:", virtualResponse);
      
      if (virtualResponse && virtualResponse.success) {
        const virtualTherapists = Array.isArray(virtualResponse.data) ? virtualResponse.data : (virtualResponse.data || []);
        
        console.log(`Virtual therapists count: ${virtualTherapists.length}`);
        
        if (virtualTherapists.length > 0) {
          console.log(`✅ Found ${virtualTherapists.length} therapists for virtual calls`);
          setAllTherapists(virtualTherapists);
          setIsVirtualOnly(true);
        } else {
          console.warn("⚠️ No virtual therapists available in database");
          setAllTherapists([]);
          setIsVirtualOnly(false);
          toast.info("No therapists available. Please run the seed script to add therapists to the database.");
        }
      } else {
        console.error("❌ Failed to get virtual therapists response:", virtualResponse);
        setAllTherapists([]);
        setIsVirtualOnly(false);
        toast.error("Failed to load virtual therapists. Please check if therapists are seeded in the database.");
      }
    } catch (error: any) {
      console.error("Error in fetchTherapists:", error);
      // Last resort: try to get any therapists
      try {
        const fallbackResponse = await therapistAPI.getAllTherapists({ limit: 10 });
        if (fallbackResponse && fallbackResponse.success && fallbackResponse.data && Array.isArray(fallbackResponse.data) && fallbackResponse.data.length > 0) {
          setAllTherapists(fallbackResponse.data);
          setIsVirtualOnly(true);
        } else {
          setAllTherapists([]);
          setIsVirtualOnly(false);
        }
      } catch (finalError: any) {
        console.error("Final fallback error:", finalError);
        setAllTherapists([]);
        setIsVirtualOnly(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPosition = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleBookSession = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    const sessionType = isVirtualOnly ? "virtual" : "in-home";
    toast.success(
      `${sessionType === "virtual" ? "Virtual" : "In-home"} booking request sent to ${therapist.name}. They will contact you soon!`
    );
    // In a real app, this would create a booking request
  };

  const getSpecializationColor = (spec: string) => {
    const colors: Record<string, string> = {
      anxiety: "bg-blue-100 text-blue-700 border-blue-200",
      depression: "bg-purple-100 text-purple-700 border-purple-200",
      trauma: "bg-red-100 text-red-700 border-red-200",
      relationships: "bg-pink-100 text-pink-700 border-pink-200",
      addiction: "bg-orange-100 text-orange-700 border-orange-200",
      stress: "bg-yellow-100 text-yellow-700 border-yellow-200",
      general: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[spec] || colors.general;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Find Nearby Therapists
          </DialogTitle>
          <DialogDescription>
            {isVirtualOnly 
              ? "No therapists found within 20km. You can book these therapists for virtual calls."
              : "Browse therapists offering in-home therapy sessions within 20km of your location"}
          </DialogDescription>
        </DialogHeader>

        {isVirtualOnly && allTherapists.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-5 mb-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Video className="w-6 h-6 text-blue-600 flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 mb-2 text-lg">Connect Virtually with Therapists</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  No therapists found within 20km of your location. You can book virtual video call sessions with the therapists below. All sessions are conducted via secure video calls.
                </p>
              </div>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        ) : allTherapists.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No therapists found</h3>
            <p className="text-muted-foreground">
              We couldn't find any therapists within 20km of your area. Please try again
              later or check back soon.
            </p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {displayedTherapists.map((therapist) => (
              <Card
                key={therapist._id}
                className="glass-card p-6 hover:scale-[1.02] smooth-transition"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {therapist.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {therapist.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({therapist.reviewCount} reviews)
                            </span>
                          </div>
                          {isVirtualOnly ? (
                            <Badge variant="outline" className="ml-2 bg-blue-50 border-blue-200 text-blue-700">
                              <Video className="w-3 h-3 mr-1" />
                              Virtual Call Available
                            </Badge>
                          ) : therapist.distance ? (
                            <Badge variant="outline" className="ml-2">
                              <Navigation className="w-3 h-3 mr-1" />
                              {therapist.distance.toFixed(1)} km away
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {therapist.specialization.slice(0, 3).map((spec) => (
                        <Badge
                          key={spec}
                          variant="outline"
                          className={getSpecializationColor(spec)}
                        >
                          {spec.charAt(0).toUpperCase() + spec.slice(1)}
                        </Badge>
                      ))}
                      {therapist.specialization.length > 3 && (
                        <Badge variant="outline">
                          +{therapist.specialization.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {therapist.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {therapist.bio}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {therapist.location.address}, {therapist.location.city}
                          {therapist.location.state && `, ${therapist.location.state}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{therapist.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span>${therapist.rate}/session</span>
                        </div>
                      </div>
                      {therapist.languages && therapist.languages.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Languages: {therapist.languages.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:w-48">
                    <Button
                      onClick={() => handleBookSession(therapist)}
                      className="w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      {isVirtualOnly ? (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Book Virtual Session
                        </>
                      ) : (
                        "Book Session"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => {
                        window.open(
                          `tel:${therapist.phone}`,
                          "_blank"
                        );
                      }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => {
                        window.open(
                          `mailto:${therapist.email}`,
                          "_blank"
                        );
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setDisplayedCount(prev => prev + 5)}
                  variant="outline"
                  className="rounded-full"
                >
                  Load More Therapists ({allTherapists.length - displayedCount} remaining)
                </Button>
              </div>
            )}
            
            {!hasMore && allTherapists.length > 0 && (
              <div className="text-center text-sm text-muted-foreground pt-4">
                {isVirtualOnly 
                  ? `Showing ${allTherapists.length} therapist${allTherapists.length !== 1 ? 's' : ''} available for virtual calls`
                  : `Showing all ${allTherapists.length} therapist${allTherapists.length !== 1 ? 's' : ''} within 20km`}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NearbyTherapists;

