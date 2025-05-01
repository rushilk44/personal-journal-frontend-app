import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <AuthenticatedHome username={user?.userName || ""} />
        ) : (
          <WelcomeSection />
        )}
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-journal-primary to-journal-accent py-12 px-4 text-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Personal Journal</h1>
        <p className="text-xl opacity-90 max-w-md mx-auto">
          Your secure space for thoughts, reflections, and personal growth
        </p>
      </div>
    </div>
  );
};

const WelcomeSection = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 text-center">
      <Card className="journal-card my-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold text-journal-primary mb-4">Welcome to Your Personal Journal</h2>
          <p className="text-gray-600 mb-6">
            A private, secure space for your thoughts, feelings, and daily reflections. 
            Write freely and keep track of your personal growth journey.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <FeatureCard 
              title="Secure & Private" 
              description="Your journal entries are private and secure, only accessible to you."
            />
            <FeatureCard 
              title="Track Your Mood" 
              description="Optional sentiment analysis helps you understand your emotional patterns."
            />
            <FeatureCard 
              title="Reflect & Grow" 
              description="Look back on your journey and see how far you've come."
            />
            <FeatureCard 
              title="Simple & Focused" 
              description="A clean interface lets you focus on what matters most - your thoughts."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-journal-primary hover:bg-journal-primary/90 w-full sm:w-auto">
                Create Your Journal
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AuthenticatedHome = ({ username }: { username: string }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="journal-card my-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-journal-primary">{username}</span>!
          </h2>
          <p className="text-gray-600 mb-6">
            Start writing your thoughts or view your previous entries.
          </p>
          
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Your Journal</h3>
            <p className="text-muted-foreground mb-4">
              Create new entries or view your previous journal entries
            </p>
            <Link to="/journal">
              <Button className="bg-journal-primary hover:bg-journal-primary/90">
                Open Journal
              </Button>
            </Link>
          </div>

          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100 mt-6">
            <h3 className="text-xl font-medium mb-2">Manage Your Profile</h3>
            <p className="text-gray-600 mb-4">
              Update your profile settings or preferences
            </p>
            <Link to="/profile">
              <Button variant="outline">
                View Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
      <h3 className="font-medium text-journal-primary mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default Index;
