import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, AlertCircle, Heart, ExternalLink } from "lucide-react";

const emergencyContacts = [
  { name: "National Mental Health Helpline", number: "1800-599-0019", available: "24/7" },
  { name: "Vandrevala Foundation", number: "1860-266-2345", available: "24/7" },
  { name: "iCall - TISS Helpline", number: "9152987821", available: "Mon-Sat, 8AM-10PM" },
];

const EmergencySupport = () => {
  return (
    <Card className="glass-card p-6 border-2 border-primary/20">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Heart className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Emergency Support</h2>
          <p className="text-sm text-muted-foreground mt-1">
            If you're in crisis or need immediate help, reach out now
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {emergencyContacts.map((contact, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-border/50"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{contact.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{contact.available}</p>
              </div>
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-primary to-secondary"
                onClick={() => window.open(`tel:${contact.number}`)}
              >
                <Phone className="w-4 h-4 mr-1" />
                {contact.number}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">You are not alone</p>
            <p className="text-xs text-muted-foreground mt-1">
              These helplines are free, confidential, and available when you need support the most
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmergencySupport;
