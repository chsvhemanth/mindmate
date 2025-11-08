import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, Shield, Brain, MessageCircle, TrendingUp, Lock, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import heroBg from "@/assets/hero-bg.jpg";
import mindmateLogo from "@/assets/mindmate-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src={mindmateLogo} 
                alt="MindMate" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
              <span className="text-lg sm:text-xl font-semibold">MindMate</span>
            </div>
            <div className="flex gap-2 items-center">
              {isAuthenticated && user && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.firstName || user.email}
                </span>
              )}
              <Button
                variant="ghost"
                onClick={() => navigate("/community")}
                className="rounded-full text-sm hidden sm:inline-flex"
              >
                <Users className="w-4 h-4 mr-1" />
                Community
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="rounded-full text-sm hidden sm:inline-flex"
              >
                Dashboard
              </Button>
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => navigate("/chat")}
                    className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm px-4 sm:px-6"
                  >
                    <MessageCircle className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Start Chat</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="rounded-full text-sm"
                    size="icon"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setLoginDialogOpen(true)}
                  className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm px-4 sm:px-6"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-gentle-pulse">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Emotional Wellness</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Your AI Therapist Who Listens with Empathy
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 leading-relaxed max-w-2xl mx-auto">
              A safe, private space to talk about your thoughts, stress, and emotions.
              Available 24/7, stigma-free, and always understanding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate("/chat")}
                className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 smooth-transition shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting Anonymously
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="rounded-full px-8 py-6 text-lg border-2 hover:bg-primary/5"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose MindMate?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with empathy, powered by AI, designed for your peace of mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="glass-card p-8 hover:scale-105 smooth-transition animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Empathetic AI</h3>
            <p className="text-foreground/70 leading-relaxed">
              Our AI is trained to respond with genuine empathy and understanding, making you feel
              heard and supported in every conversation.
            </p>
          </Card>

          <Card className="glass-card p-8 hover:scale-105 smooth-transition animate-slide-up [animation-delay:0.1s]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">100% Private</h3>
            <p className="text-foreground/70 leading-relaxed">
              Your conversations are completely confidential. We never share your data, and you're
              always in control of your information.
            </p>
          </Card>

          <Card className="glass-card p-8 hover:scale-105 smooth-transition animate-slide-up [animation-delay:0.2s]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Emotion Aware</h3>
            <p className="text-foreground/70 leading-relaxed">
              Advanced emotion detection helps MindMate understand your feelings and provide
              personalized, contextual support.
            </p>
          </Card>

          <Card className="glass-card p-8 hover:scale-105 smooth-transition animate-slide-up [animation-delay:0.3s]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Track Your Progress</h3>
            <p className="text-foreground/70 leading-relaxed">
              Visualize your emotional journey with insightful charts and AI-generated weekly
              summaries of your mental wellness.
            </p>
          </Card>

          <Card className="glass-card p-8 hover:scale-105 smooth-transition animate-slide-up [animation-delay:0.4s]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">24/7 Availability</h3>
            <p className="text-foreground/70 leading-relaxed">
              Whether it's 3 AM or 3 PM, MindMate is always here to listen. No appointments, no
              waiting—just instant support.
            </p>
          </Card>

          <Card className="glass-card p-8 hover:scale-105 smooth-transition animate-slide-up [animation-delay:0.5s]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Stigma-Free</h3>
            <p className="text-foreground/70 leading-relaxed">
              No judgment, no stigma—just a safe space where you can be yourself and express your
              feelings freely.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="glass-card p-12 max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who have found comfort, clarity, and peace through MindMate.
            Your mental wellness matters.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/chat")}
            className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 smooth-transition shadow-lg hover:shadow-xl"
          >
            Begin Your Journey
          </Button>
          <p className="text-sm text-muted-foreground mt-6">
            Free to start • No credit card required • 100% confidential
          </p>
        </Card>
      </section>

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            <strong>Crisis Support:</strong> If you're in immediate danger, please reach out to a
            helpline.
          </p>
          <p className="text-sm">
            MindMate is a supportive tool and does not replace professional mental health care.
          </p>
          <p className="text-sm mt-4">© 2024 MindMate. Your privacy and well-being are our priority.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
