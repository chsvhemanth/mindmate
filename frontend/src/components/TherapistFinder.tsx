import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Video, Calendar, Search } from "lucide-react";
import { useState } from "react";

const therapists = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Clinical Psychologist",
    experience: "12 years",
    rating: 4.8,
    reviews: 156,
    location: "Mumbai, Maharashtra",
    distance: "2.3 km away",
    price: "₹1,500/session",
    available: "Today, 3:00 PM",
    online: true,
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "Psychiatrist",
    experience: "15 years",
    rating: 4.9,
    reviews: 203,
    location: "Delhi NCR",
    distance: "5.1 km away",
    price: "₹2,000/session",
    available: "Tomorrow, 10:00 AM",
    online: true,
  },
  {
    id: 3,
    name: "Dr. Anita Patel",
    specialty: "Counseling Psychologist",
    experience: "8 years",
    rating: 4.7,
    reviews: 89,
    location: "Bangalore, Karnataka",
    distance: "3.8 km away",
    price: "₹1,200/session",
    available: "Today, 6:00 PM",
    online: false,
  },
];

const TherapistFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-3">Find a Therapist Near You</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {therapists.map((therapist) => (
          <Card key={therapist.id} className="glass-card p-5 hover:scale-[1.01] smooth-transition">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {therapist.name.split(" ").map(n => n[0]).join("")}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{therapist.name}</h3>
                    <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold">{therapist.rating}</span>
                    <span className="text-sm text-muted-foreground">({therapist.reviews})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {therapist.experience} experience
                  </Badge>
                  {therapist.online && (
                    <Badge className="text-xs bg-gradient-to-r from-primary to-secondary">
                      <Video className="w-3 h-3 mr-1" />
                      Online Available
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {therapist.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {therapist.available}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <p className="text-lg font-semibold text-primary">{therapist.price}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full">
                      View Profile
                    </Button>
                    <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-secondary">
                      Book Session
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-card p-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <p className="text-sm text-center text-muted-foreground">
          All therapists are verified and licensed professionals. Sessions are confidential and secure.
        </p>
      </Card>
    </div>
  );
};

export default TherapistFinder;
